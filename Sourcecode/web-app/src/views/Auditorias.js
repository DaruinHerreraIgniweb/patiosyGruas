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
import { SECONDORY_COLOR } from "../common/sharedFunctions";
import { colors } from "components/Theme/WebTheme";

export default function Auditoria() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);

  const columns = [
    { title: t('auditoria_date'), field: 'date' },
    { title: t('auditoria_name'), field: 'name' },    
    { title: t('auditoria_action'), field: 'action' }
  ];

  const [data, setData] = useState([]);
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
    if (auditoriasdata.auditorias) {
      setData(auditoriasdata.auditorias);
    } else {
      setData([]);
    }
  }, [auditoriasdata.auditorias]);

  useEffect(()=>{
    if(data) {

      let dataSorted = data.sort((a,b)=>(moment(b.date) - moment(a.date)))

      const formattedData = dataSorted.map(item => {
        const timestamp = parseInt(item.date);
        const formattedDate = new Date(timestamp).toLocaleString();
        return { ...item, date: formattedDate };
      });

      SetSortedData(formattedData)
    }
  },[data])



  
  return (
    auditoriasdata.loading ? <CircularLoading /> :
      <ThemeProvider theme={theme}>
        <MaterialTable
          title={t('auditorias_offer_title')}
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
        />
      </ThemeProvider>
  );

}
