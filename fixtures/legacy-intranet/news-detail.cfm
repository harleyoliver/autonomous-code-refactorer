<cfinclude template="includes/header.cfm">

<!-- Verify URL parameter context -->
<cfparam name="URL.id" default="10">

<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
    <tr>
        <td valign="top" style="padding: 20px;">
            <!-- Breadcrumb Navigation using old-school pipe dividers -->
            <font face="Arial" size="1" color="#777777">
                <a href="index.cfm" style="color: #777777; text-decoration:none;">Hub Home</a> | 
                <a href="news-category.cfm?cat=internal" style="color: #777777; text-decoration:none;">Operational Dispatch</a> | 
                Current Dispatch Article
            </font>
            <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="10" />

            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td valign="top" width="70%">
                        <!-- Dynamic content lookup simulation based on ID parameter -->
                        <cfif URL.id EQ "10">
                            <font face="Arial" size="5" color="#002855"><strong>Catchment Infrastructure Upgrades Authorized for Zone C</strong></font><br>
                            <font face="Arial" size="2" color="#666666">Published by: <em>Director of Infrastructure Operations</em> | Timestamp: 10-May-2015</font>
                            <hr size="1" color="#CCCCCC" style="margin-top:10px; margin-bottom:15px;">
                            
                            <img src="https://picsum.photos/id/10/400/200" align="right" border="1" style="margin-left: 20px; margin-bottom: 15px; border-color: #333333;" />
                            
                            <p style="font-family: Arial; font-size: 13px; color: #333333; line-height: 150%; margin: 0 0 12px 0;">
                                Following exhaustive analytical sweeps of current pipeline load balances, the Capital Works Management Grid has finalized systemic funding overrides for the primary Zone C spillway networks. This structural remediation aims to integrate electronic safety overrides directly into downstream telemetry grids.
                            </p>
                            <p style="font-family: Arial; font-size: 13px; color: #333333; line-height: 150%; margin: 0 0 12px 0;">
                                Contracted field tech assets are slated to establish operations perimeter frames starting early next Monday. Field engineers operating within Zone C vectors must synchronize internal monitoring systems with the central desk switch hourly to protect metric capture chains.
                            </p>
                        <cfelse>
                            <!-- General article fallback content mapping -->
                            <font face="Arial" size="5" color="#002855"><strong>Standard Corporate Security Directive Reference Log</strong></font><br>
                            <font face="Arial" size="2" color="#666666">Published by: <em>Global Security & Risk Management</em> | Timestamp: 14-Jan-2015</font>
                            <hr size="1" color="#CCCCCC" style="margin-top:10px; margin-bottom:15px;">
                            <p style="font-family: Arial; font-size: 13px; color: #333333;">Standard data packet sequence loaded for unindexed log indices. Request fresh asset assignment mappings if validation check fields register empty state flags.</p>
                        </cfif>

                        <br><br>
                        <!-- EMPLOYEE COMMENT DEBT SECTOR -->
                        <table width="100%" border="0" cellpadding="8" cellspacing="0" bgcolor="#F9F9F9" style="border: 1px solid #EAEAEA;">
                            <tr bgcolor="#E6EDF5">
                                <td><font face="Arial" size="2" color="#002855"><strong>Employee Responses (2)</strong></font></td>
                            </tr>
                            <tr>
                                <td style="border-bottom: 1px dotted #CCCCCC;">
                                    <font face="Arial" size="2" color="#333333"><strong>T. Jenkins (Field Operations)</strong> <font size="1" color="#666666">at 11-May-2015 08:14 AM</font></font><br>
                                    <font face="Arial" size="2" color="#444444">Will the new telemetry nodes require local alignment adjustments during the baseline configuration phase, or are they preset from the terminal house?</font>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <font face="Arial" size="2" color="#333333"><strong>M. Henderson (Catchment Super)</strong> <font size="1" color="#666666">at 11-May-2015 10:45 AM</font></font><br>
                                    <font face="Arial" size="2" color="#444444">Tom, check the safety docs file. The preset limits should execute out of the container directly unless the main SCADA bus fails to handshake.</font>
                                </td>
                            </tr>
                        </table>

                    </td>
                    <!-- Right padding column gutter margin -->
                    <td width="5%"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="20" height="1" /></td>
                    
                    <!-- Meta Utilities Box -->
                    <td valign="top" width="25%">
                        <table width="100%" border="0" cellpadding="8" cellspacing="0" style="border: 1px solid #DDDDDD; background-color:#FAFAFA;">
                            <tr>
                                <td>
                                    <font face="Arial" size="2" color="#333333"><strong>Article Options</strong></font>
                                    <hr size="1" color="#DDDDDD">
                                    <div style="margin-top:8px;">
                                        <img src="https://picsum.photos/id/160/12/12" align="absmiddle" /> 
                                        <a href="javascript:window.print();" style="font-family:Arial; font-size:11px; color:#002855; text-decoration:none;">Print Friendly Layout</a>
                                    </div>
                                    <div style="margin-top:6px;">
                                        <img src="https://picsum.photos/id/342/12/12" align="absmiddle" /> 
                                        <a href="mailto:?subject=NexusHub%20Log" style="font-family:Arial; font-size:11px; color:#002855; text-decoration:none;">Email to Sub-Team</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<cfinclude template="includes/footer.cfm">
