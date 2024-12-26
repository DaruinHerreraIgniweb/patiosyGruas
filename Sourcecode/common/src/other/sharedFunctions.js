import { firebase } from "../config/configureFirebase";
import { GetDistance } from "../other/GeoFunctions";
import { onValue, child, push, update } from "firebase/database";

function generarCadenaAleatoria(longitud = 20) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  const caracteresLength = caracteres.length;

  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
  }

  return resultado;
}

export const getRandomId = (list) => {
  let id = generarCadenaAleatoria();
  
  if (list.length > 0) {
    let found = false;
    while(!found) {
        const find = list.find(item => item.id == id);
        if(find) {
            id = generarCadenaAleatoria();
        } else {
            found = true;
        }
    }
  }
      
  return id;
}

export const formatBookingObject = async (bookingData, settings) => {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const reference = [...Array(6)].map(_ => c[~~(Math.random()*c.length)]).join('');
  
  const { config } = firebase;
  let today;
  try{
      let res =  await fetch(`https://${config.projectId}.web.app/getservertime`, { method: 'GET', headers: {'Content-Type': 'application/json'}});
      const json = await res.json();
      if(json.time){
        today = json.time;
      } else{
        today = new Date().getTime();
      }
  }catch (err){
    today = new Date().getTime();
  }

  let pickUp = { lat: bookingData.pickup.coords.lat, lng: bookingData.pickup.coords.lng, add: bookingData.pickup.description };
  let drop = { lat: bookingData.drop.coords.lat, lng: bookingData.drop.coords.lng, add: bookingData.drop.description };
  
  let coords = [{latitude: pickUp.lat,longitude: pickUp.lng}];
  if(bookingData.drop.waypointsStr){
      bookingData.drop.waypointsStr.split("|").forEach((point)=>{
          let lat = point.split(',')[0];
          let lng = point.split(',')[1];
          coords.push({latitude: parseFloat(lat), longitude: parseFloat(lng)});
      });
  }
  coords.push({latitude: drop.lat,longitude: drop.lng});
  
  var otp;
  if(bookingData.settings.otp_secure)
      otp = Math.floor(Math.random() * 90000) + 10000;
  else{
      otp = false;
  }
  return {
      carType: bookingData.carDetails.name,
      carImage: bookingData.carDetails.image,
      customer: bookingData.userDetails.uid,
      commission_type: bookingData.carDetails.convenience_fee_type,
      commission_rate: bookingData.carDetails.convenience_fees,
      reference: reference,
      customer_email: bookingData.userDetails.email,
      customer_name: bookingData.userDetails.firstName + ' ' + bookingData.userDetails.lastName,
      customer_contact: bookingData.userDetails.mobile? bookingData.userDetails.mobile: ' ',
      customer_token: bookingData.userDetails.pushToken? bookingData.userDetails.pushToken: ' ',
      customer_image: bookingData.userDetails.profile_image ? bookingData.userDetails.profile_image : "",
      drop: drop,
      pickup: pickUp,
      estimate: bookingData.estimate.estimateFare,
      estimateDistance: bookingData.estimate.estimateDistance,
      distance: bookingData.estimate.estimateDistance,
      estimateTime:bookingData.estimate.estimateTime,
      status: "NEW",
      bookLater:bookingData.bookLater,
      tripdate: bookingData.bookLater?bookingData.tripdate:today,
      bookingDate: today,
      otp: otp,
      booking_type_admin:bookingData.booking_type_admin,
      coords: coords,
      waypoints: bookingData.drop.waypoints? bookingData.drop.waypoints: null,
      roundTrip: bookingData.roundTrip? bookingData.roundTrip:null,
      tripInstructions: bookingData.tripInstructions? bookingData.tripInstructions: null,
      trip_cost: bookingData.estimate.estimateFare,
      convenience_fees: bookingData.estimate.convenience_fees,
      driver_share: (parseFloat(bookingData.estimate.estimateFare) - parseFloat(bookingData.estimate.convenience_fees)).toFixed(settings.decimal),
      fleet_admin_comission: bookingData.carDetails.fleet_admin_fee ? bookingData.carDetails.fleet_admin_fee : null,
      paymentPacket: bookingData.paymentPacket? bookingData.paymentPacket : null,
      requestedDrivers: bookingData.requestedDrivers?  bookingData.requestedDrivers: null,
      driverEstimates: bookingData.driverEstimates?  bookingData.driverEstimates: null,
      ...bookingData.instructionData,
      fleetadmin: bookingData.fleetadmin? bookingData.fleetadmin:null,
      payment_mode: bookingData.payment_mode,
      booking_from_web: bookingData.booking_from_web? bookingData.booking_from_web: false
  }
}

export const saveAddresses = async (booking, driverLocation) => {
  const { singleUserRef } = firebase;
  let address = booking.drop.add;

  onValue(child(singleUserRef(booking.customer), "savedAddresses"), (savedAdd) => {
      if (savedAdd.val()) {
        let addresses = savedAdd.val();
        let didNotMatch = true;
        for (let key in addresses) {
          let entry = addresses[key];
          if (
            GetDistance(
              entry.lat,
              entry.lng,
              booking.drop.lat,
              booking.drop.lng
            ) < 0.1
          ) {
            didNotMatch = false;
            let count = entry.count ? entry.count + 1 : 1;
            update(child(singleUserRef(booking.customer),"savedAddresses/" + key),{ count: count });
            break;
          }
        }
        if (didNotMatch) {
          push(child(singleUserRef(booking.customer),"savedAddresses"),{
            description: address,
            lat: booking.drop.lat,
            lng: booking.drop.lng,
            count: 1,
          });
        }
      } else {
        push(child(singleUserRef(booking.customer),"savedAddresses"),{
          description: address,
          lat: booking.drop.lat,
          lng: booking.drop.lng,
          count: 1,
        });
      }
    },{onlyOnce: true});
  return address;
};

export const addActualsToBooking = async (booking, address, driverLocation) => {
  const end_time = new Date();
  const diff = (end_time.getTime() - parseFloat(booking.startTime)) / 1000;
  const totalTimeTaken = Math.abs(Math.round(diff));
  booking.trip_end_time = end_time.getHours() + ":" + end_time.getMinutes() + ":" + end_time.getSeconds();
  booking.endTime = end_time.getTime();
  booking.total_trip_time = totalTimeTaken;
  return booking;
};

export const updateDriverQueue = (booking) => {
  const {
    singleUserRef
  } = firebase;
  if(booking.status === 'NEW' && booking.driver && booking.prepaid){
    booking.status = "ACCEPTED";
  }
  update(singleUserRef(booking.driver),{ queue: true });
  return booking;
};

export const driverQueue= false;
