import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { useTranslation } from "react-i18next";
import { api } from 'common';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import { ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CircularLoading from "components/CircularLoading";
import theme from "styles/tableStyle";
import { getRandomId, SECONDORY_COLOR } from "../common/sharedFunctions";
import { colors } from "components/Theme/WebTheme";

export default function Patios() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editPatio,
    editInventario,
    editAuditoria
  } = api;
  const settings = useSelector(state => state.settingsdata.settings);

  const columns = [
    { title: t('patio_name'), field: 'patio_name' },
    { title: t('patio_address'), field: 'patio_address' },    
    { title: t('patio_phone'), field: 'patio_phone', type: 'numeric' },
    { title: t('patio_livianos_capacity'), field: 'cupo_livianos', type: 'numeric' },
    { title: t('patio_medianos_capacity'), field: 'cupo_medianos', type: 'numeric' },
    { title: t('patio_pesados_capacity'), field: 'cupo_pesados', type: 'numeric' },
    { title: t('patio_max_livianos'), field: 'max_livianos', type: 'numeric' },
    { title: t('patio_max_medianos'), field: 'max_medianos', type: 'numeric' },
    { title: t('patio_max_pesados'), field: 'max_pesados', type: 'numeric' },
    { title: t('patio_lat'), field: 'patio_lat', type: 'numeric' },
    { title: t('patio_lng'), field: 'patio_lng', type: 'numeric' },
  ];

  const [data, setData] = useState([]);
  const patiosdata = useSelector(state => state.patiosdata);
  const inventariosdata = useSelector(state => state.inventariosdata);  
  const auditoriasdata = useSelector(state => state.auditoriasdata);
  const dispatch = useDispatch();
  const [sortedData, SetSortedData] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const auth = useSelector(state => state.auth);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if(auth.profile && auth.profile.usertype){
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

  useEffect(() => {
    if (patiosdata.patios) {
      if (role == "parkingOwner") {
        const id = auth.profile.id || auth.profile.uid;
        const patios = patiosdata.patios.filter(patio => patio.owner == id);
        setData(patios); 
      } else {
        setData(patiosdata.patios);
      }
    } else {
      setData([]);
    }
  }, [patiosdata.patios]);

  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data])


  return (
    patiosdata.loading ? <CircularLoading /> :
      <ThemeProvider theme={theme}>
        <MaterialTable
          title={t('patio_offer_title')}
          columns={columns}
          style={{
            direction: isRTL === "rtl" ? "rtl" : "ltr",
            borderRadius: "8px",
            boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
            padding: "20px",
          }}
          data={sortedData}
          onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
            }),
            editable:{
              backgroundColor: colors.Header_Text,
              fontSize: "0.8em",
              fontWeight: 'bold ',
            },
            headerStyle: {
              position: "sticky",
              top: "0px",
              fontSize: "0.8em",
              fontWeight: 'bold ',
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
          localization={{body:{
            addTooltip: (t('add')),
            deleteTooltip: (t('delete')),
            editTooltip: (t('edit')),
            emptyDataSourceMessage: (
              (t('blank_message'))
          ),
          editRow: { 
            deleteText: (t('delete_message')),
            cancelTooltip: (t('cancel')),
            saveTooltip: (t('save')) 
            }, 
            },
            toolbar: {
              searchPlaceholder: (t('search')),
              exportTitle: (t('export')),
            },
            header: {
              actions: (t('actions')) 
          },
          pagination: {
            labelDisplayedRows: ('{from}-{to} '+ (t('of'))+ ' {count}'),
            firstTooltip: (t('first_page_tooltip')),
            previousTooltip: (t('previous_page_tooltip')),
            nextTooltip: (t('next_page_tooltip')),
            lastTooltip: (t('last_page_tooltip'))
          },
          }}
          editable={{
            onRowDelete: oldData =>
              settings.AllowCriticalEditsAdmin?
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  const inventarios = inventariosdata.inventarios;
                  let obj = inventarios.find(elem => elem.patio_id == oldData.id);
                  if (obj) {
                    dispatch(editInventario(obj, "Delete"));
                  }
                  dispatch(editPatio(oldData,"Delete"));
                }, 600);
              })
              :
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  alert(t('demo_mode'));
                }, 600);
              })
          }}
          actions={[
            role === "admin" && {
              icon: 'add',
              tooltip: t("add_patio_title"),
              isFreeAction: true,
              onClick: () => navigate('/patios/editPatio')
            },
            (rowData) => ({
              tooltip: t("edit"),
              icon: () => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginRight: 0
                  }}
                >
                  <EditIcon />
                </div>
              ),
              onClick: (event, rowData) => {
                navigate(`/patios/editpatio/${rowData.id}`)
              }
            })
          ]}
          
        />
      </ThemeProvider>
  );

}
