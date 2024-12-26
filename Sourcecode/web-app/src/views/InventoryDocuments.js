import React, { useState, useEffect, useRef } from "react";
import { Typography, Grid, Card, Avatar, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { colors } from "../components/Theme/WebTheme";
import CircularLoading from "../components/CircularLoading";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AlertDialog from "../components/AlertDialog";
import { api } from "common";
import {MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY} from "../common/sharedFunctions"
import { makeStyles } from "@mui/styles";
import { fetchInventarios, updateNewDocument } from "common/src/actions/inventarioactions";
const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: "10px",
    backgroundColor: SECONDORY_COLOR,
    minHeight: 60,
    minWidth: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 2,
    marginBottom: 10,
    boxShadow: `0px 2px 5px ${MAIN_COLOR}`,
  },
  txt: {
    padding: 10,
    fontWeight: "bold",
    minHeight: 60,
    backgroundColor:SECONDORY_COLOR,
    color: colors.LandingPage_Background,
    boxShadow: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:FONT_FAMILY
  },
  buttonStyle:{
    borderRadius: "19px",
    minHeight: 50,
    minWidth: 150,
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
    fontFamily:FONT_FAMILY
  },
  avatar:{
    width: 300,
    height: 250,
    display: "flex",
    flexDirection: "column",
    boxShadow: 3,
    border: `2px dashed ${colors.TABLE_BORDER}`,
    fontSize: 16,
    background: "none",
    color: "inherit",
    fontWeight: "bold",
  }
}));

function UserDocuments() {
  const { id, rId } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const inventariosdata = useSelector(state => state.inventariosdata);
  const [inventorysaved, setInventorysaved] = useState(null);
  const dispatch = useDispatch();
  const IdInputRef = useRef();
  const loaded = useRef(false);
  const [editable, setEditable] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const settings = useSelector(state => state.settingsdata.settings);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();  

  useEffect(() => {
    const patioInventory = inventariosdata?.inventarios?.find((inv) => inv.patio_id == rId.toString())
    if (patioInventory) {
        setInventorysaved(patioInventory);
    
        const car = patioInventory?.inventory?.find((inv) => inv.id == id.toString());
        setData(car);

        const url = car.evidences.find(url => url.includes("NUEVO_DOCUMENTO") && url.includes('.xlsx'));
        if (url) {
            setAlreadyUploaded(true);
        } else {
            setAlreadyUploaded(false);
        }

    } else {
        setData([]);
    }

    loaded.current = true;
  }, [id, rId, navigate, data]);

  useEffect(() => {
    
  });

  const IdImageChange = async (e) => {
    setIdImage(e.target.files[0]);
  };
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleSaveInventory = () => {
    setLoading(true);
    if(settings.AllowCriticalEditsAdmin) {
        const file = idImage;

        if (file) {
            try {
                dispatch(updateNewDocument(data, file, inventorysaved)).then(
                    () => {
                        dispatch(fetchInventarios());
            
                        setTimeout(() => {
                            setIdImage(null);
                            setLoading(false);
                            setEditable(false);
                            loaded.current = true;
                            navigate("/inventarios");
                        }, 600);
                    }
                )
            } catch(error) {
                setIdImage(null);
                setLoading(false);
                setEditable(false);
                loaded.current = true;
            }
        }
    }
  };

  const handleCancel = () => {
    setIdImage(null);
    setEditable(false);
  };

    const handleDownload = (url = null) => {
        if (data.evidences && data.evidences.length > 0) {            
            if (!url) {
                url = data.evidences.find(url => url.includes("PATIOSYGRUAS_ORIGINAL") && url.includes('.xlsx')); 
            }
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'documento';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.log('No se encontró un archivo Excel (.xlsx) para descargar');
            }
        } else {
            console.log('No hay archivo para descargar');
        }
    }; 

    const setEditableIfNotUploaded = () => {
        if (data.evidences && data.evidences.length > 0) {
            const url = data.evidences.find(url => url.includes("NUEVO_DOCUMENTO") && url.includes('.xlsx'));
            if (url) {
                setEditable(false);
                setAlreadyUploaded(true);

                handleDownload(url);
            } else {
                setEditable(true);
            }
        } else {
            window.alert("Este inventario no tiene documentos subidos.");
        }
    };

  return loading ? (
    <CircularLoading />
  ) : (
    <>
      <div>
        <Card
          style={{
            borderRadius: "19px",
            backgroundColor: colors.WHITE,
            minHeight: 200,
            marginTop: 20,
            marginBottom: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: isRTL === "rtl" ? "flex-end" : "flex-start",
            }}
          >
            <Typography
              variant="h5"
              style={{
                margin: "10px 10px 0 5px",
                fontFamily:FONT_FAMILY
              }}
            >
              {t("documents_title")}
            </Typography>
            <div
              style={{
                display: "flex",
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  navigate(`/users/${rId}`);
                }}
              >
                <Typography
                  style={{
                    margin: "10px 10px 0 5px",
                    textAlign: isRTL === "rtl" ? "right" : "left",
                    fontWeight: "bold",
                    color:MAIN_COLOR,
                    fontFamily:FONT_FAMILY
                  }}
                >
                  {`<<- ${t("go_back")}`}
                </Typography>
              </Button>
            </div>
          </div>

          <Grid
            container
            spacing={1}
            direction="column"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >

            <Grid item>
              <Grid
                container
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
                marginY={10}
                gap={2}
                sx={{
                  display: "flex",
                  flexDirection:  "row",
                  direction:isRTL === "rtl" ? "rtl" : "ltr",
                }}
              >
                {editable ? (
                  <>
                    <>
                    <div
                        onClick={() => IdInputRef.current.click()}
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 30,
                        cursor: "pointer",
                        }}
                    >
                        <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3}}>
            
                        {
                          idImage ? 
                          <>
                              <InsertDriveFileIcon
                                  sx={{
                                  fontSize: 100,
                                  marginBottom: 3,
                                  color: colors.Header_Text_back,
                                  fontFamily:FONT_FAMILY
                                  }}
                              />

                              <Typography sx={{ textAlign: "center" }} fontFamily={FONT_FAMILY}>
                                  {t("document_loaded")}
                              </Typography>
                          </>
                          : (
                            <>
                              <FileUploadIcon
                                sx={{
                                  fontSize: 100,
                                  marginBottom: 3,
                                  color: colors.Header_Text_back,
                                  fontFamily: FONT_FAMILY
                                }}
                              />
                              <Typography sx={{ textAlign: "center" }} fontFamily={FONT_FAMILY}>
                                {t("upload_doc_details")}
                              </Typography>
                            </>
                          )
                        }
                          
                        </Avatar>
                    </div>

                    <input
                        onChange={(event) => IdImageChange(event)}
                        multiple={false}
                        ref={IdInputRef}
                        type="file"
                        hidden
                      />
                    </>
                  </>
                ) : (
                  <Grid container spacing={10}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 30,
                      }}
                    >
           
                      <Grid
                        item
                        sx={{
                          display: "block",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                          <div onClick={() => handleDownload(null)}>
                            <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3, cursor:"pointer",fontFamily:FONT_FAMILY,textAlign:"center"}}>
                              <DownloadIcon
                                  sx={{
                                  fontSize: 100,
                                  marginBottom: 3,
                                  color: colors.Header_Text_back,
                                  fontFamily:FONT_FAMILY
                                  }}
                              />
                              {t("download_document")}
                            </Avatar>
                          </div>
                      </Grid>

                      <Grid
                        item
                        sx={{
                          display: "block",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div onClick={setEditableIfNotUploaded}>
                            <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3, cursor:"pointer",fontFamily:FONT_FAMILY,textAlign:"center"}}>                                
                              {
                                alreadyUploaded ?
                                <DownloadIcon
                                sx={{
                                fontSize: 100,
                                marginBottom: 3,
                                color: colors.Header_Text_back,
                                fontFamily:FONT_FAMILY
                                }}
                            />
                                  : 

                                  <FileUploadIcon
                                      sx={{
                                      fontSize: 100,
                                      marginBottom: 3,
                                      color: colors.Header_Text_back,
                                      fontFamily:FONT_FAMILY
                                      }}
                                  />
                              }
                              
                              {alreadyUploaded ? t("download_new_document") : t("upload_document")}
                            </Avatar>
                          </div>
                      </Grid>

                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>


            <Grid item>
              {!editable && !alreadyUploaded ? (
                <Button className={classes.buttonStyle}
                  style={{
                    backgroundColor: MAIN_COLOR,
                    width: "50%",
                  }}
                  variant="contained"
                  onClick={() => setEditable(true)}
                  sx={{
                    cursor: "pointer",
                    borderColor: colors.CARD_DETAIL,
                  }}
                >
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      color:colors.WHITE,
                      fontWeight:"bold",
                      fontFamily:FONT_FAMILY
                    }}
                  >
                    {t("edit")}
                  </Typography>
                </Button>
              ) : alreadyUploaded ? null : ( 
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: isRTL === "rtl" ? "row-reverse" : "row",
                    gap: 10,
                  }}
                >
                  <Button className={classes.buttonStyle}
                    style={{
                      backgroundColor: colors.GREEN,
                      width: "40%",
                    }}
                    variant="contained"
                    onClick={handleSaveInventory}
                  >
                    <Typography
                      style={{
                        color: colors.WHITE,
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight:"bold",
                        fontFamily:FONT_FAMILY
                      }}
                    >
                      {t("save")}
                    </Typography>
                  </Button>
                  <Button className={classes.buttonStyle}
                    style={{
                      backgroundColor:colors.RED,
                      width: "40%",
                    }}
                    variant="contained"
                    onClick={handleCancel}
                  >
                    <Typography
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight:"bold",
                        color:colors.WHITE,
                        fontFamily:FONT_FAMILY
                      }}
                    >
                      {t("cancel")}
                    </Typography>
                  </Button>
                </div>
              )}
            </Grid>


          </Grid>
        </Card>
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
          {commonAlert.msg}
        </AlertDialog>
      </div>
    </>
  );
}

export default UserDocuments;
