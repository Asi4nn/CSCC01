import React, { useContext, useEffect, useState } from 'react'
import { View} from 'react-native'
import { AppContext } from '../../store/root'
import { Button} from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useHistory } from "../../router";
import 'bootstrap/dist/css/bootstrap.min.css';


export const Browse = observer(() => {
    const appState = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        appState.profile.setPage(0);
        appState.profile.getUsers();
    }, [])
    return (
        <View>
            <input type="text" id="myInput" onKeyUp={() => filter()} placeholder="Search this table.."></input>
            {
            <table className="table" id="table">
                <thead>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Company Name</th>
                    <th>User Type</th>
                </thead>
                <tbody>
                {
                    appState.profile.data.map( datum => {
                        return (
                            <tr key={datum.email}>
                                <td> {datum.email} </td>
                                <td> {datum.first_name} </td>
                                <td> {datum.last_name} </td>
                                <td> {datum.company_name} </td>
                                <td> {datum.user_type} </td>
                                <td>  
                                    <Button mode="contained" onPress={() => {
                                        history.push(`/profile/${datum.socials_link}`);
                                    }}>
                                        Link
                                    </Button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            }
        </View>
    )
})

function filter() {
    var input, filter, table, tr, i;
    input = document.getElementById("myInput");
    filter = input !== null ? input.value.toUpperCase() : null;
    table = document.getElementById("table");
    tr = table !== null ? table.getElementsByTagName("tr") : [];  
    for (i = 0; i < tr.length; i++) {
      var rowContent = tr[i].textContent;    
      rowContent = rowContent !== null ? rowContent.replace(/[\s]+/g, ' ') : null;
      if (rowContent) {
        if (rowContent.toUpperCase().includes(filter)) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }  
    }
  }
