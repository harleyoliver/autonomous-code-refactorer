<cfinclude template="includes/header.cfm">

<table width="98%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
        <td valign="top">
            <font face="Arial" color="#002855" size="5"><strong>IT Infrastructure Systems & Status Grid</strong></font>
            <hr size="2" color="#002855">
            <br>

            <!-- INFRASTRUCTURE STATUS OVERVIEW TABLE -->
            <table width="100%" border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; border-color:#BBBBBB; font-family:Arial; font-size:12px;">
                <tr bgcolor="#002855">
                    <th><font color="white">System Sub-Node Architecture</font></th>
                    <th><font color="white">Current Run State</font></th>
                    <th><font color="white">Telemetry Latency</font></th>
                    <th><font color="white">Incident Action File</font></th>
                </tr>
                <tr bgcolor="#EEF7EE">
                    <td><strong>Central SQL Core Database (NexusWaterLocal)</strong></td>
                    <td align="center"><font color="green"><strong>● NOMINAL OPERATIONAL</strong></font></td>
                    <td align="center">14 ms</td>
                    <td align="center"><font color="#666666">No Active System Tickets</font></td>
                </tr>
                <tr bgcolor="#FFF2F2">
                    <td><strong>Objective ECM SOAP Gateway Interface</strong></td>
                    <td align="center"><font color="red"><strong>▲ DEGRADED PERFORMANCE</strong></font></td>
                    <td align="center">1840 ms</td>
                    <td align="center">
                        <a href="javascript:void(0);" onclick="window.open('http://google.com','ticketWin','width=400,height=300');" style="color:#CC0000; font-weight:bold;">View Ticket #9821</a>
                    </td>
                </tr>
                <tr bgcolor="#EEF7EE">
                    <td><strong>SCADA Pipeline Control Interface (Zone-B Gate)</strong></td>
                    <td align="center"><font color="green"><strong>● NOMINAL OPERATIONAL</strong></font></td>
                    <td align="center">4 ms</td>
                    <td align="center"><font color="#666666">No Active System Tickets</font></td>
                </tr>
            </table>

            <br><br><br>
            <!-- IT HELPDESK TICKET CREATION SECTOR -->
            <font face="Arial" size="4" color="#002855"><strong>Submit an Infrastructure Support Request</strong></font>
            <hr size="1" color="#CCCCCC">
            
            <form name="itTicketForm" action="it-services.cfm" method="POST" style="margin-top:10px;">
                <table width="100%" border="0" cellpadding="6" cellspacing="0" bgcolor="#F9F9F9" style="border:1px dashed #CCCCCC; font-family:Arial; font-size:12px;">
                    <tr>
                        <td width="150" align="right"><strong>Operator Employee ID:</strong></td>
                        <td><input type="text" name="txtEmpID" size="15" value="EMP-" /></td>
                    </tr>
                    <tr>
                        <td align="right"><strong>Affected Node System:</strong></td>
                        <td>
                            <select name="selSystem">
                                <option value="db">Central SQL Datastore Engine</option>
                                <option value="ecm">Objective ECM Document System</option>
                                <option value="scada">Telemetry Terminal Array / Flow Valves</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top"><strong>Incident Core Symptoms:</strong></td>
                        <td><textarea name="txtSymptoms" cols="50" rows="4"></textarea></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <input type="button" value="Dispatch Incident Crew" onclick="alert('System Logged: Incident pipeline has been successfully queued into tracking registers.');" style="font-weight:bold;" />
                        </td>
                    </tr>
                </table>
            </form>
        </td>
    </tr>
</table>

<cfinclude template="includes/footer.cfm">
