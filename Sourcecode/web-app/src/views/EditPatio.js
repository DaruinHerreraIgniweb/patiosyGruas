import React, { useState, useEffect, useRef } from "react";
import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircularLoading from "components/CircularLoading";
import { colors } from "components/Theme/WebTheme";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from "react-router-dom";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY, getRandomId } from "../common/sharedFunctions";

const useStyles = makeStyles((theme) => ({
  typography: {
      fontFamily: FONT_FAMILY,
    },
  textField: {
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  selectField: {
      color: "black",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: MAIN_COLOR,
      },
  },
  rootRtl_3: {
      "& label": {
          right: 17,
          left: "auto",
          paddingRight: 12,
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 20,
          fontFamily: FONT_FAMILY,
      },
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  rootRtl: {
      "& label": {
          right: 20,
          left: "auto",
          paddingRight: 20,
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 15,
          fontFamily: FONT_FAMILY,
      },
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  rootRtl_1: {
      "& label": {
          right: 0,
          left: "auto",
          paddingRight: 20,
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 30,
          fontFamily: FONT_FAMILY,
      },
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  rootRtl_2: {
      "& label": {
          right: 17,
          left: "auto",
          paddingRight: 12,
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 25,
          fontFamily: FONT_FAMILY,
      },
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  rootRtl_4: {
      "& label": {
          right: 17,
          left: "auto",
          paddingRight: 12,
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 15,
          fontFamily: FONT_FAMILY,
      },
      "& label.Mui-focused": {
          color: MAIN_COLOR,
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiFilledInput-underline:after": {
          borderBottomColor: MAIN_COLOR,
      },
      "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
              borderColor: MAIN_COLOR,
          },
      },
      "& input": {
          fontFamily: FONT_FAMILY,
        },
  },
  selectField_rtl: {
      color: "black",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: MAIN_COLOR,
      },
      "& label": {
          right: 0,
          left: "auto",
          fontFamily: FONT_FAMILY,
      },
      "& legend": {
          textAlign: "right",
          marginRight: 35,
          fontFamily: FONT_FAMILY,
      },
  },

  right: {
      textAlign: "right",
      right: 0,
      left: "auto",
      paddingRight: 40,
      fontFamily: FONT_FAMILY,
  },
}));

const EditPatio = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const isRTL = i18n.dir();
  const settings = useSelector((state) => state.settingsdata.settings);
  const patios = useSelector(state => state.patiosdata.patios);
  const inventarios = useSelector(state => state.inventariosdata.inventarios);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.usersdata);
  const [loding, setLoding] = useState(false);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const { editPatio, editInventario } = api;
  const [parkingOwners, setParkingOwners] = useState([]);
  const classes = useStyles();
  const [data, setData] = useState();
  const [oldData, setOldData] = useState(null);
  const [parkingOwnerObj, setParkingOwnerObj] = useState(null);

  const [role, setRole] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (auth.profile && auth.profile.usertype) {
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

  useEffect(() => {
    if (role === "admin" && userdata.users) {
      const owners = userdata.users.filter((user) => user.usertype == "parkingOwner");
      setParkingOwners(owners);
    }
  }, [role, userdata.users]);

  useEffect(() => {
    if (data && data.owner && userdata.users) {
      const foundUser = userdata.users.find(user => user.id == data.owner);
      if (foundUser) {
        setParkingOwnerObj(foundUser);
      }
    }
  }, [data, userdata.users]);

  const handleInputChange = (e) => {
      setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleInputToNumberChange = (e) => {
      setData({ ...data, [e.target.id]: Number(e.target.value) });
  };

  const handleCommonAlertClose = (e) => {
      e.preventDefault();
      setCommonAlert({ open: false, msg: "" });
  };

  const handleChangeParkingOwner = (event) => {
    const selectedId = event.target.value;
    if (selectedId === "") {
      setParkingOwnerObj(null);
      setData({ ...data, owner: null });
    } else {
      const selectedOwner = parkingOwners.find(owner => owner.id === selectedId);
      if (selectedOwner) {
        setParkingOwnerObj(selectedOwner);
        setData({ ...data, owner: selectedOwner.id });
      }
    }
  };

  const handelUpdate = () => {
    settings.AllowCriticalEditsAdmin ?
        new Promise((resolve, reject) => {
            setLoding(true);
            setTimeout(() => {
                if(!data.patio_name){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_name_error')});
                    reject();
                }else if(!data.patio_address){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_address_error')});
                    reject();
                }else if(!data.patio_phone){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_phone_error')});
                    reject();
                }else if(!data.cupo_livianos){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_cupo_livianos_error')});
                    reject();
                }else if(!data.cupo_medianos){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_cupo_medianos_error')});
                    reject();
                }else if(!data.cupo_pesados){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_cupo_pesados_error')});
                    reject();
                }else if(!data.max_livianos){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_max_livianos_error')});
                    reject();
                }else if(!data.max_medianos){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_max_medianos_error')});
                    reject();
                }else if(!data.max_pesados){
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_max_pesados_error')});
                    reject();
                }else if(!data.patio_lat){
                  setLoding(false);
                  setCommonAlert({ open: true, msg: t('patio_lat_error')});
                  reject();                
                } else if(!data.patio_lng){
                  setLoding(false);
                  setCommonAlert({ open: true, msg: t('patio_lng_error')});
                  reject();
                } else if(!data.owner) {
                    setLoding(false);
                    setCommonAlert({ open: true, msg: t('patio_owner_error')});
                    reject();
                } else {
                    if (data !== oldData) {
                        delete data.tableData;
                        data['patio_name'] = data.patio_name;
                        data['patio_address'] = data.patio_address;
                        data['patio_phone'] = data.patio_phone;
                        data['cupo_livianos'] = data.cupo_livianos;
                        data['cupo_medianos'] = data.cupo_medianos;
                        data['cupo_pesados'] = data.cupo_pesados;
                        data['max_livianos'] = data.max_livianos;
                        data['max_medianos'] = data.max_medianos;
                        data['max_pesados'] = data.max_pesados;
                        data['patio_lat'] = data.patio_lat;
                        data['patio_lng'] = data.patio_lng;
                        data['owner'] = data.owner;

                        dispatch(editPatio(data, "Update"));
                        
                        if (!oldData) {
                            let id = getRandomId(inventarios);
                            const inventory = {
                                "id": id,
                                "patio_id": data.id,
                                "patio_name": data.patio_name,
                                "inventory": []
                            }
                            dispatch(editInventario(inventory, "Update"));
                        }
                        
                        setLoding(false);
                        navigate("/patios");
                        resolve();
                    } else {
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t("make_changes_to_update") });
                    }
                }
            }, 600);
        })
        :
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                setCommonAlert({ open: true, msg: t("demo_mode") });
            }, 600);
        });
  };

  useEffect(() => {
    if (id && patios) {
      const patioData = patios.find(item => item.id === id.toString());
      if (!patioData) {
        navigate("/404");
      } else {
        setData(patioData);
        setOldData(patioData);
  
        if (patioData.owner && userdata.users) {
          const foundUser = userdata.users.find(user => user.id === patioData.owner);
          if (foundUser) {
            setParkingOwnerObj(foundUser);
          } else {
            setParkingOwnerObj(null);
          }
        } else {
          setParkingOwnerObj(null);
        }
      }
    } else if (!id) {
      setParkingOwnerObj(null);

      let newId = getRandomId(patios);
      setData({
        id: newId,
        patio_name: "",
        patio_address: "",
        patio_phone: "",
        cupo_livianos: "",
        cupo_medianos: "",
        cupo_pesados: "",
        max_livianos: "",
        max_medianos: "",
        max_pesados: "",
        patio_lat: 0,
        patio_lng: 0,
        owner: null
      });
    } else {
      navigate("/404");
    }
  }, [id, patios, navigate, userdata.users]);

  return loding ? (
    <CircularLoading />
  ) : (
    <div>
      <Card
          style={{
              borderRadius: "19px",
              backgroundColor: colors.WHITE,
              minHeight: 100,
              maxWidth: "75vw",
              marginTop: 20,
              marginBottom: 20,
              padding: 25,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
          }}
      >
          <Typography
              variant="h5"
              style={{
                  marginTop: -15,
                  textAlign: isRTL === "rtl" ? "right" : "left",
                  fontFamily: FONT_FAMILY,
              }}
          >
              {id ? t("update_patio_title") : t("add_patio_title")}
          </Typography>
          <div
              dir={isRTL === "rtl" ? "rtl" : "ltr"}
          >
              <Button
                  variant="text"
                  onClick={() => {
                      navigate("/patios");
                  }}
              >
                  <Typography
                      style={{
                          marginBottom: 10,
                          textAlign: isRTL === "rtl" ? "right" : "left",
                          fontWeight: "bold",
                          color: MAIN_COLOR,
                          fontFamily: FONT_FAMILY,
                      }}
                  >
                      {`<<- ${t("go_back")}`}
                  </Typography>
              </Button>
          </div>

          <Grid
              container
              spacing={2}

              sx={{
                  gridTemplateColumns: "50%",
                  direction: isRTL === 'rtl' ? 'rtl' : 'ltr'
              }}
          >
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_name")}
                      id="patio_name"
                      value={data?.patio_name || ""}
                      fullWidth
                      onChange={handleInputChange}
                      className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_address")}
                      id="patio_address"
                      value={data?.patio_address || ""}
                      fullWidth
                      onChange={handleInputChange}
                      className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_phone")}
                      id="patio_phone"
                      value={data?.patio_phone || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_3 : classes.textField}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_livianos_capacity")}
                      id="cupo_livianos"
                      value={data?.cupo_livianos || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_medianos_capacity")}
                      id="cupo_medianos"
                      value={data?.cupo_medianos || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_pesados_capacity")}
                      id="cupo_pesados"
                      value={data?.cupo_pesados || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_max_livianos")}
                      id="max_livianos"
                      value={data?.max_livianos || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_max_medianos")}
                      id="max_medianos"
                      value={data?.max_medianos || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_max_pesados")}
                      id="max_pesados"
                      value={data?.max_pesados || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_lat")}
                      id="patio_lat"
                      value={data?.patio_lat || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                      InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                      label={t("patio_lng")}
                      id="patio_lng"
                      value={data?.patio_lng || 0}
                      type="number"
                      fullWidth
                      onChange={handleInputToNumberChange}
                      className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <FormControl fullWidth style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}>
                    <InputLabel
                    id="demo-simple-select-label"
                    className={isRTL === "rtl" ? classes.right : ""}
                    sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                    >
                    <Typography className={classes.typography}>{t("parkingOwner")}</Typography>
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={parkingOwnerObj?.id || ""}
                        disabled={role !== "admin"}
                        label={t("parkingOwner")}
                        onChange={handleChangeParkingOwner}
                        className={isRTL === "rtl" ? classes.selectField_rtl : classes.selectField}
                        >
                        <MenuItem value="">
                            <em>Ninguno</em>
                        </MenuItem>
                        {role === "admin" && parkingOwners.length > 0 ? (
                            parkingOwners.map((e) => (
                            <MenuItem
                                key={e.id}
                                style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                                value={e.id}
                            >
                                <Typography className={classes.typography}>{e.firstName} {e.lastName}</Typography>
                            </MenuItem>
                            ))
                        ) : null}
                        </Select>
                </FormControl>
                </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                      style={{
                          borderRadius: "19px",
                          backgroundColor: MAIN_COLOR,
                          minHeight: 50,
                          minWidth: "100%",
                          textAlign: "center",
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                      }}
                      onClick={handelUpdate}
                      variant="contained"
                  >
                      <Typography
                          style={{
                              color: colors.WHITE,
                              textAlign: "center",
                              fontSize: 16,
                              fontFamily: FONT_FAMILY,
                          }}
                      >
                          {id ? t("update") : t("add")}
                      </Typography>
                  </Button>
              </Grid>
          </Grid>
      </Card>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
          {commonAlert.msg}
      </AlertDialog>
  </div>
  );

};

export default EditPatio;