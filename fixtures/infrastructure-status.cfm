<cfinclude template="legacy-intranet/includes/header.cfm">

<cftry>
    <cfquery name="GetPipeMetricsRaw" datasource="NexusWaterLocal" timeout="2">
        SELECT pipe_id, sector_zone, current_psi, max_threshold, last_inspection 
        FROM pipeline_core 
        WHERE status = 'ACTIVE' AND sector_zone = 'ZONE-B'
        ORDER BY current_psi DESC
    </cfquery>
    <cfset GetPipeMetrics = GetPipeMetricsRaw>
    
    <cfcatch type="any">
        <cfset GetPipeMetrics = queryNew("pipe_id,sector_zone,current_psi,max_threshold,last_inspection", "VarChar,VarChar,Integer,Integer,VarChar")>
        
        <cfset queryAddRow(GetPipeMetrics)>
        <cfset querySetCell(GetPipeMetrics, "pipe_id", "PIPE-104-B")>
        <cfset querySetCell(GetPipeMetrics, "sector_zone", "ZONE-B")>
        <cfset querySetCell(GetPipeMetrics, "current_psi", 142)>
        <cfset querySetCell(GetPipeMetrics, "max_threshold", 120)>
        <cfset querySetCell(GetPipeMetrics, "last_inspection", "14-May-2015")>

        <cfset queryAddRow(GetPipeMetrics)>
        <cfset querySetCell(GetPipeMetrics, "pipe_id", "PIPE-209-B")>
        <cfset querySetCell(GetPipeMetrics, "sector_zone", "ZONE-B")>
        <cfset querySetCell(GetPipeMetrics, "current_psi", 95)>
        <cfset querySetCell(GetPipeMetrics, "max_threshold", 115)>
        <cfset querySetCell(GetPipeMetrics, "last_inspection", "02-Apr-2015")>

        <cfset queryAddRow(GetPipeMetrics)>
        <cfset querySetCell(GetPipeMetrics, "pipe_id", "PIPE-088-B")>
        <cfset querySetCell(GetPipeMetrics, "sector_zone", "ZONE-B")>
        <cfset querySetCell(GetPipeMetrics, "current_psi", 112)>
        <cfset querySetCell(GetPipeMetrics, "max_threshold", 115)>
        <cfset querySetCell(GetPipeMetrics, "last_inspection", "19-Jan-2015")>
    </cfcatch>
</cftry>

<table width="98%" border="0" align="center" cellpadding="10" cellspacing="0" bgcolor="#FFFFFF" style="margin-top:15px; border:1px solid #CCCCCC;">
    <tr>
        <td valign="top">
            <font face="Arial, Helvetica, sans-serif" color="#002855" size="5">
                <strong>SCADA Pipeline Telemetry Matrix -- Sector Zone B</strong>
            </font>
            <hr size="2" color="#002855">
            <br>

            <p style="font-family:Arial; font-size:12px; color:#444444; line-height:140%;">
                <strong>Active Monitoring Mode:</strong> Polling local vector switch array endpoints. Values evaluate physical pounds per square inch (PSI) load signatures matching automated flow regulator controls.
            </p>

            <table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse; border-color:#CCCCCC; font-family:Arial; font-size:12px; margin-top:15px;">
                <tr bgcolor="#002855">
                    <th><font color="white">Pipeline Identifier</font></th>
                    <th><font color="white">Operational Zone</font></th>
                    <th><font color="white">Current Metric Load</font></th>
                    <th><font color="white">Max Design Limit</font></th>
                    <th><font color="white">Last Quality Sweep</font></th>
                    <th><font color="white">Status Evaluation Flag</font></th>
                </tr>

                <cfoutput query="GetPipeMetrics">
                    <tr <cfif current_psi GT max_threshold>bgcolor="##FFFFEE"<cfelse>bgcolor="##FFFFFF"</cfif>>
                        <td><strong>#pipe_id#</strong></td>
                        <td align="center">#sector_zone#</td>
                        <td align="right">
                            <font <cfif current_psi GT max_threshold>color="##CC0000" style="font-weight:bold;"</cfif>>#current_psi# PSI</font>
                        </td>
                        <td align="right">#max_threshold# PSI</td>
                        <td align="center">#last_inspection#</td>
                        <td>
                            <cfif current_psi GT max_threshold>
                                <font color="##CC0000"><strong>🚨 CRITICAL OVERPRESSURE WARNING DETECTED</strong></font>
                            <cfelse>
                                <font color="##006600">Nominal load threshold profile.</font>
                            </cfif>
                        </td>
                    </tr>
                </cfoutput>
            </table>

            <br><br>
            <div style="background-color:#F5F5F5; border:1px solid #DDDDDD; padding:10px; font-family:Arial; font-size:11px; color:#666666;">
                <strong>System Registry Trace:</strong> Lucee Web Core Gateway // Core Processors: Stable // Database Direct Handshake State: <font color="orange"><strong>MOCK_FAILOVER_ACTIVE</strong></font>
            </div>
        </td>
    </tr>
</table>

<cfinclude template="legacy-intranet/includes/footer.cfm">
