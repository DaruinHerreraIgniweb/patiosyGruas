import { React } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput,StyleSheet } from 'react-native';
import { colors } from './theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import { api } from 'common';
import BidCabModal from '../components/BidCabModal';
import { Button, Icon } from 'react-native-elements';
import { fonts } from './font';

export const MAIN_COLOR = colors.BIDTAXIPRIMARY;
export const SECONDORY_COLOR = colors.BIDTAXISECONDORY;

export const appConsts = {
    needEmergemcy: true,
    hasMultiDrop: false,
    makePending: false,
    hasOptions: false,
    checkWallet: false,
    acceptWithAmount: true,
    hasStartOtp: true,
    canCall: true,
    showBookingOptions: false,
    captureBookingImage: false
}

export const checkSearchPhrase = (str) => {
    return str;
}

export const FormIcon = (props)=>{
    return <View style={{width: '15%',alignItems: 'center'}}>
        <MaterialCommunityIcons name="car-info" size={24} color={colors.HEADER} />
    </View>
}

export const CarHorizontal = (props) => {
    const { t } = i18n;
    const {onPress, carData, styles} = props;
    return (
        <TouchableOpacity onPress={onPress} style={{height:'100%'}}>
            <View style={styles.imageStyle}>
                <Image resizeMode="contain" source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
            </View>
            <View style={[styles.textViewStyle, { height: 40 }]}>
                <Text style={styles.text1}>{carData.name.toUpperCase()}</Text>
                {carData.extra_info && carData.extra_info != '' ?
                    <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center',marginTop:5 }}>
                        {
                            carData.extra_info.split(',').map((ln) => <Text style={styles.text2} key={ln} >{ln}</Text>)
                        }
                    </View>
                    : null}
                <View  style={{ marginTop: 10 }}>
                    <Text style={styles.text2}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const CarVertical = (props) =>{
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const {onPress, carData, settings, styles} = props;
    return (
        <TouchableOpacity
            style={[styles.carContainer, { borderWidth: 1, borderColor: carData.active == true ? colors.BIDTAXIPRIMARY : colors.WHITE,flexDirection:isRTL?'row-reverse':'row'}]}
            onPress={onPress}
        >
            <Image
                source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')}
                resizeMode="contain"
                style={styles.cardItemImagePlace}
            ></Image>
            <View style={[styles.bodyContent, { alignContent: 'center', flexDirection: 'column', justifyContent: 'center' }]}>
                <Text style={[styles.titleStyles,{textAlign:isRTL?'right':'left'}]}>{carData.name.toUpperCase()}</Text>
                <View style={{ flexDirection:isRTL?'row-reverse':'row', alignItems: 'center' }}>
                    {carData.extra_info && carData.extra_info != '' ?
                        <View style={{ justifyContent: 'space-around', marginLeft: 3 }}>
                            {
                                carData.extra_info.split().map((ln) => <Text key={ln} style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT, textAlign: isRTL ? 'right': 'left' }]} >{ln}</Text>)
                            }
                        </View>
                    : null}
                </View>
                <Text style={[styles.text2,{textAlign:isRTL?'right':'left'}]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
            </View>
        </TouchableOpacity>
    )
}


export const validateBookingObj = async (t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson) => {
    const {
        getDistanceMatrix,
        GetDistance,
    } = api;
    addBookingObj['roundTrip'] = roundTrip;
    if(otherPerson)addBookingObj['instructionData'] = instructionData;
    addBookingObj['tripInstructions'] = tripInstructions;
    if (settings.autoDispatch && bookingType == false) {
        let requestedDrivers = {};
        let driverEstimates = {};
        let startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        let distArr = [];
        let allDrivers = [];
        if(drivers && drivers.length > 0){
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                if (settings.convert_to_mile) {
                    distance = distance / 1.609344;
                }
                if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && driver.carType === tripdata.carType.name) {
                    driver["distance"] = distance;
                    allDrivers.push(driver);
                }
            }
            const sortedDrivers = settings.useDistanceMatrix ? allDrivers.slice(0, 25) : allDrivers;
            if (sortedDrivers.length > 0) {
                let driverDest = "";
                for (let i = 0; i < sortedDrivers.length; i++) {
                    let driver = { ...sortedDrivers[i] };
                    driverDest = driverDest + driver.location.lat + "," + driver.location.lng
                    if (i < (sortedDrivers.length - 1)) {
                        driverDest = driverDest + '|';
                    }
                }
                if (settings.useDistanceMatrix) {
                    distArr = await getDistanceMatrix(startLoc, driverDest);
                } else {
                    for (let i = 0; i < sortedDrivers.length; i++) {
                        distArr.push({ timein_text: ((sortedDrivers[i].distance * 2) + 1).toFixed(0) + ' min', found: true })
                    }
                }
                for (let i = 0; i < sortedDrivers.length; i++) {
                    if (distArr[i].found) {
                        let driver = {}
                        driver.id = sortedDrivers[i].id;
                        driver.distance = sortedDrivers[i].distance;
                        driver.timein_text = distArr[i].timein_text;
                        requestedDrivers[driver.id] = true;
                        driverEstimates[driver.id] = {distance: driver.distance, timein_text :  driver.timein_text};
                    }
                }
                addBookingObj['requestedDrivers'] = requestedDrivers;
                addBookingObj['driverEstimates'] = driverEstimates;
            }
        } else{
            return { error: true, msg : t('no_driver_found_alert_messege')}
        }
    }
    return { addBookingObj };
}

export default function BookingModal(props){
    return <BidCabModal {...props} />
}

export const prepareEstimateObject =  async (tripdata, instructionData) => {
    const { t } = i18n;
    const {
        getDirectionsApi
    } = api;
    try {
        const startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        const destLoc = tripdata.drop.lat + ',' + tripdata.drop.lng;
        let routeDetails = null;
        let waypoints = '';
        if (tripdata.drop && tripdata.drop.waypoints && tripdata.drop.waypoints.length > 0) {
            const origin = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
            const arr = tripdata.drop.waypoints;
            for (let i = 0; i < arr.length; i++) {
                waypoints = waypoints + arr[i].lat + ',' + arr[i].lng;
                if (i < arr.length - 1) {
                    waypoints = waypoints + '|';
                }
            }
            const destination = tripdata.drop.lat + ',' + tripdata.drop.lng;
            routeDetails = await getDirectionsApi(origin, destination, waypoints);
        } else {
            routeDetails = await getDirectionsApi(startLoc, destLoc, null);
        }
        const estimateObject = {
            pickup: { coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng }, description: tripdata.pickup.add },
            drop: { coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng }, description: tripdata.drop.add, waypointsStr: waypoints != '' ? waypoints : null, waypoints: waypoints != '' ? tripdata.drop.waypoints : null },
            carDetails: tripdata.carType,
            routeDetails: routeDetails
        };
        return { estimateObject };
    } catch (err) {
        return { error: true, msg : t('not_available')}
    }
}

export const ExtraInfo = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const {estimate, item, uid, amount, setAmount, styles, onPressAccept} = props;
    const nextPrice = parseFloat(parseFloat(item.estimate) + parseFloat((item.estimate * 10)/100)).toFixed(2);
    const prePrice = parseFloat(parseFloat(item.estimate) - parseFloat((item.estimate * 10)/100)).toFixed(2);
    return (
        <>
            <View style={[styles.textContainerStyle, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                <View style={{width: 'auto'}}>
                    <Text style={styles.textHeading}>{t('tripInstructions')} - </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.textContent}>
                        {item? (item.tripInstructions) : ''}
                    </Text>
                </View>
            </View>
            {/*
            <View style={[styles.textContainerStyle, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                <Text style={styles.textHeading}>{t('roundTrip')} - </Text>
                <Text style={styles.textContent}>
                { item.roundTrip? t('yes'):t('no')}
                </Text>
            </View>
            */}            
            <View style={[styles.textContainerStyle, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                <Text style={styles.textHeading}>{t('payment_mode')} - </Text>
                <Text style={styles.textContent}>
                {t(item.payment_mode)}
                </Text>
            </View>
            {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid])?
                <View style={{flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent:'space-evenly', alignItems: 'center', marginTop:10 }}>
                    <Button
                        onPress={()=> {
                            let allAmts = {...amount};
                            allAmts[item.id] = prePrice;
                            setAmount(allAmts);
                            onPressAccept(item, prePrice); 
                        }}
                        title={prePrice}
                        buttonStyle={{
                            backgroundColor:MAIN_COLOR,
                            minHeight: 45,
                            padding: 2,
                            borderColor: colors.TRANSPARENT,
                            borderWidth: 0,
                            borderRadius: 10,
                        }}
                        titleStyle={{
                            alignSelf: 'center',
                            padding:10
                        }}
                    />
                    <Button
                        onPress={()=> {
                            let allAmts = {...amount};
                            allAmts[item.id] = item.estimate;
                            setAmount(allAmts);
                            onPressAccept(item, item.estimate);
                        }}
                        title={item.estimate}
                        buttonStyle={{
                            backgroundColor: MAIN_COLOR,
                            minHeight: 45,
                            padding: 2,
                            borderColor: colors.TRANSPARENT,
                            borderWidth: 0,
                            borderRadius: 10,
                        }}
                        titleStyle={{
                            alignSelf: 'center',
                            padding:10
                        }}
                    />
                    <Button
                        onPress={()=> {
                            let allAmts = {...amount};
                            allAmts[item.id] =nextPrice;
                            setAmount(allAmts);
                            onPressAccept(item, nextPrice);
                        }}
                        title={nextPrice}
                        buttonStyle={{
                            backgroundColor: MAIN_COLOR,
                            minHeight: 45,
                            padding: 2,
                            borderColor: colors.TRANSPARENT,
                            borderWidth: 0,
                            borderRadius: 10,
                        }}
                        titleStyle={{
                            alignSelf: 'center',
                            padding:10
                        }}
                    />
                </View>
            :null}

            {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid])?
                <View style={styles.box}>
                <TextInput
                    style={[styles.dateTextStyle,{ textAlign: isRTL ? "right" : "left" }]}
                    placeholder={t('amount')}
                    onChangeText={(value) => {
                        let allAmts = {...amount};
                        allAmts[item.id] = value;
                        setAmount(allAmts)
                    }}
                    value={amount[item.id] && !isNaN(amount[item.id])?amount[item.id].toString():null}
                    keyboardType="number-pad"
                />
            </View>
            : null}
        </>
    )
}

export const RateView = (props) => {
    const {settings, item, uid, styles} = props;
    return (
        item && item.driverOffers && item.driverOffers[uid]?
        <View style={styles.rateViewStyle}>
        {settings.swipe_symbol === false ?
            <Text style={styles.rateViewTextStyle}>{settings.symbol}{parseFloat(item.driverOffers[uid].trip_cost).toFixed(2)}</Text>
            :
            <Text style={styles.rateViewTextStyle}>{parseFloat(item.driverOffers[uid].trip_cost).toFixed(2)}{settings.symbol}</Text>
        }
        </View>
        
    :null
    )
}

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

const styles = StyleSheet.create({
    rateViewTextStyle: {
        fontSize: 25,
        color: colors.BLACK,
        fontFamily: fonts.Bold,
        textAlign: "center"
    },
    rateViewStyle: {
        alignItems: 'center'
    },
});