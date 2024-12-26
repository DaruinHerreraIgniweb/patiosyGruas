import React, { useState, useEffect, useRef } from "react";
import { downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment/min/moment-with-locales';
import { colors } from "../components/Theme/WebTheme";
import AlertDialog from "../components/AlertDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import { Typography, } from "@mui/material";
import {MAIN_COLOR,SECONDORY_COLOR, getRandomId} from "../common/sharedFunctions"
import EditIcon from '@mui/icons-material/Edit';
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Inventarios() {
  const navigate = useNavigate();
  const {id} = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editInventario,
    fetchInventarios,
    editPatio,
    editAuditoria
  } = api;
  const [data, setData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const inventariosdata = useSelector((state) => state.inventariosdata);
  const patiosdata = useSelector((state) => state.patiosdata);
  const auditoriasdata = useSelector((state) => state.auditoriasdata);
  const [totalInventarios, SetTotalInventarios] = useState([]);
  const [patioOptions, SetPatioOptions] = useState([]);

  const [selectedPatio, setSelectedPatio] = useState(""); // Estado para el patio seleccionado


  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();
  const loaded = useRef(false);
  const [role, setRole] = useState(null);
  const [fleetAdminsObj, setFleetAdminsObj] = useState();
  const [sortedData, SetSortedData] = useState([]);

  useEffect(() => {
    dispatch(fetchInventarios())
  }, [dispatch, fetchInventarios]);

  useEffect(() => {
    const inventarios = inventariosdata.inventarios;
    
    if (inventarios.length > 0) {
      
      const id = auth.profile.id || auth.profile.uid;
      const patios = patiosdata.patios.filter(patio => patio.owner === id);
      const ids = patios.map(elem => elem.id);
      const filteredInventarios = inventarios.filter(inventario => ids.includes(inventario.patio_id));

      SetTotalInventarios(filteredInventarios);

      const options = filteredInventarios.map((inventario) => (        
        <option key={inventario.id} value={inventario.id}>
          {inventario.patio_name}
        </option>
      ));

      SetPatioOptions(options);
    }
    loaded.current = true;
  }, [inventariosdata]);

  const handlePatioChange = (e) => {
    
    let found = false;
    const inventarios = inventariosdata.inventarios;
    inventarios.forEach((inventario) => {
      if (inventario.id === e.target.value) {
        if (inventario.inventory) {
          setData(inventario.inventory);
        } else {
          setData([]);
        }

        setSelectedPatio(inventario);
        found = true;
      }
    });

    if (!found) {
      setData([]);
    }
  };

  useEffect(() => {
    dispatch(fetchInventarios());
  }, [dispatch, fetchInventarios]);

  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data])

  useEffect(() => {
    if (auth.profile && auth.profile.usertype) {
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

 
  const handelApproved = (rowData) => {
    const id = rowData.tableData.id;
    const inventarios = inventariosdata.inventarios;
  
    if (!rowData.approved) {
      const isConfirmed = window.confirm(t("dialog_confirm_approve"));
      if (!isConfirmed) {
        return;
      }

      let obj = inventarios.find(elem => elem.patio_id === selectedPatio.patio_id);
      obj.inventory[id].approved = !rowData.approved;
    
      setData(obj.inventory);
      dispatch(editInventario(obj, "Update"));
      dispatch(fetchInventarios());
    } else {
      window.alert(t("cant_change_status"));
    }
  };

  const columns = [
    { title: t("inventario_type"), field: "type", initialEditValue: "" },
    { title: t("description"), field: "description", initialEditValue: "" },
    {
      title: t("inventario_aprobado"),
      field: "approved",
      type: "boolean",
      render: (rowData) => (
        <Switch
          disabled={!settings.AllowCriticalEditsAdmin}
          checked={rowData.approved}
          onChange={() => handelApproved(rowData)}
        />
      ),
    }
  ];

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };

  const [selectedRow, setSelectedRow] = useState(null);

  return !loaded.current ? (
    <CircularLoading />
  ) : (
    <div style={{ backgroundColor: colors.LandingPage_Background }}>
      <ThemeProvider theme={theme}>

      <div style={{ display: "block", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: 99, left: "50%", transform: "translateX(-50%)", marginTop: "40px" }}>
        <label htmlFor="patio-select" style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
          {t("select_patio")}
        </label>
        <select
          id="patio-select"
          value={selectedPatio}
          onChange={handlePatioChange}
          style={{
            padding: "5px",
            marginLeft: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
            outline: "none",
            transition: "border-color 0.3s",
            textAlign: "center",
          }}
          onFocus={(e) => e.target.style.borderColor = '#007BFF'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
        >
          <option value="">{t("select_option")}</option>
          {patioOptions}
        </select>
      </div>

        <MaterialTable
          title={t("inventario_offer_title")}
          columns={columns}
          style={{
            direction: isRTL === "rtl" ? "rtl" : "ltr",
            borderRadius: "8px",
            boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
            padding: "20px",
          }}
          data={sortedData}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
            exportCsv: (columns, data) => {
              let hArray = [];
              const headerRow = columns.map((col) => {
                if (typeof col.title === "object") {
                  return col.title.props.text;
                }
                hArray.push(col.field);
                return col.title;
              });
              const dataRows = data.map(({ tableData, ...row }) => {
                row.createdAt =
                  new Date(row.createdAt).toLocaleDateString() +
                  " " +
                  new Date(row.createdAt).toLocaleTimeString();
                row.fleetadmin = row.fleetadmin
                  ? fleetAdminsObj[row.fleetadmin]
                  : "";
                let dArr = [];
                for (let i = 0; i < hArray.length; i++) {
                  dArr.push(row[hArray[i]]);
                }
                return Object.values(dArr);
              });
              const { exportDelimiter } = ",";
              const delimiter = exportDelimiter ? exportDelimiter : ",";
              const csvContent = [headerRow, ...dataRows]
                .map((e) => e.join(delimiter))
                .join("\n");
              const csvFileName = "download.csv";
              downloadCsv(csvContent, csvFileName);
            },
            exportButton: {
              csv: settings.AllowCriticalEditsAdmin,
              pdf: false,
            },
            maxColumnSort: "all_columns",
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
            }),
            editable: {
              backgroundColor: colors.Header_Text,
              fontSize: "0.8em",
              fontWeight: "bold ",
            },
            headerStyle: {
              position: "sticky",
              top: "0px",
              fontSize: "0.8em",
              fontWeight: "bold ",
              color: colors.BLACK,
              backgroundColor: SECONDORY_COLOR,
              textAlign: "center",
              border: `1px solid ${colors.TABLE_BORDER}`,
            },
            cellStyle: {
              border: `1px solid ${colors.TABLE_BORDER}`,
              textAlign: "center",
            },
            actionsColumnIndex: -1,
          }}
          localization={{
            body: {
              addTooltip: (t('add')),
              deleteTooltip: t("delete"),
              emptyDataSourceMessage: t("blank_message"),
              editRow: {
                deleteText: t("delete_message"),
                cancelTooltip: t("cancel"),
                saveTooltip: t("save"),
              },
            },
            toolbar: {
              selectPatio: t("select_patio"),
              searchPlaceholder: t("search"),
              exportTitle: t("export"),
            },
            header: {
              actions: t("actions"),
            },
            pagination: {
              labelDisplayedRows: "{from}-{to} " + t("of") + " {count}",
              firstTooltip: t("first_page_tooltip"),
              previousTooltip: t("previous_page_tooltip"),
              nextTooltip: t("next_page_tooltip"),
              lastTooltip: t("last_page_tooltip"),
            },
          }}
          editable={{
            onRowDelete: (oldData) =>
              settings.AllowCriticalEditsAdmin
                ? new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      const inventarios = inventariosdata.inventarios;
                      let obj = inventarios.find(elem => elem.patio_id == selectedPatio.patio_id);
                      let carType = obj.inventory[oldData.tableData.id].type;
                      obj.inventory.splice(oldData.tableData.id, 1);

                      let patios = patiosdata.patios;
                      let patioFound = null;
                      for(let i = 0; i < patios.length; i++) {
                        let patio = { ...patios[i] };
                        if (patio.id == selectedPatio.patio_id) {
                          patioFound = patio;
                        }
                      }

                      if (patioFound) {
                        patioFound[`cupo_${carType.toLowerCase()}s`] = patioFound[`cupo_${carType.toLowerCase()}s`] + 1;
                        dispatch(editPatio(patioFound, "Update"));
                      }

                      dispatch(editInventario(obj, "Update"));

                      const id = getRandomId(auditoriasdata.auditorias);
                      const auditoria = {
                        "id": id,
                        "action": t("log_delete_inventory"),
                        "date": new Date().getTime(),
                        "name": auth.profile.firstName + " " + auth.profile.lastName,
                      }
                      dispatch(editAuditoria(auditoria, "Add"));
                    }, 600);
                  })
                : new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      alert(t("demo_mode"));
                    }, 600);
                  }),
          }}
          actions={[
            (rowData) => (
              {
              icon: () => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    padding: 10,
                    backgroundColor: MAIN_COLOR,
                    borderRadius: 5,
                  }}
                >
                  <Typography style={{ color: colors.LandingPage_Background }}>
                    {t("documents")}
                  </Typography>
                </div>
              ),
              tooltip: t("documents"),
              onClick: () => navigate(`/inventarios/cardocuments/${rowData.patio_id}/${rowData.id}`),
            })           
          ]}
        />
      </ThemeProvider>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
}
