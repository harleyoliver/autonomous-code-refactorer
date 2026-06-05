<cfquery name="GetPipeMetrics" datasource="NexusWaterLocal">
    SELECT pipe_id, sector_zone, current_psi, max_threshold, last_inspection 
    FROM pipeline_core 
    WHERE status = 'ACTIVE' AND sector_zone = 'ZONE-B'
    ORDER BY current_psi DESC
</cfquery>

<html>
<head>
    <title>NexusHub - Daily Water Pressure Ops</title>
    <style>
        body { font-family: "Courier New", monospace; background-color: #f0f0f0; }
        .alert-high { color: #FF0000; font-weight: bold; background-color: #FFFF00; }
        .normal-row { color: #003366; }
    </style>
</head>
<body>
    <font size="5" color="#003366"><b>NEXUS WATER OPERATIONS -- ZONE B STATUS</b></font>
    <hr size="2" color="#003366">

    <p>Current Server Timestamp: <cfoutput>#Now()#</cfoutput></p>

    <table border="1" cellpadding="5" cellspacing="0" bgcolor="#FFFFFF" width="90%">
        <tr bgcolor="#003366">
            <th><font color="white">Pipe ID</font></th>
            <th><font color="white">Zone</font></th>
            <th><font color="white">Current PSI</font></th>
            <th><font color="white">Max Operational Limit</font></th>
            <th><font color="white">Status Check</font></th>
        </tr>

        <cfoutput query="GetPipeMetrics">
            <tr class="<cfif current_psi GT max_threshold>alert-high<cfelse>normal-row</cfif>">
                <td>#pipe_id#</td>
                <td>#sector_zone#</td>
                <td>#current_psi# PSI</td>
                <td>#max_threshold# PSI</td>
                <td>
                    <cfif current_psi GT max_threshold>
                        🚨 CRITICAL OVERPRESSURE DETECTED
                    <cfelse>
                        Nominal operational load.
                    </cfif>
                </td>
            </tr>
        </cfoutput>
    </table>

    <hr size="1" color="#CCCCCC">
    <font size="1" color="#666666">System managed by Operations v2.1.0. Internal Use Only.</font>
</body>
</html>
