<cfinclude template="includes/header.cfm">

<cfparam name="URL.empSearch" default="">

<cfset employeeResults = queryNew("uid,cn,title,radio_id,photo_id", "VarChar,VarChar,VarChar,VarChar,VarChar")>

<cfif len(trim(URL.empSearch))>
    <cftry>
        <cfldap action="query"
                name="ldapRawQuery"
                server="directory.nexus.local"
                port="389"
                start="ou=Operations,ou=Staff,dc=nexus,dc=local"
                scope="subtree"
                attributes="uid,cn,title,pager"
                filter="(sn=#URL.empSearch#*)"
                maxrows="3"
                timeout="3">
                
        <cfset employeeResults = ldapRawQuery>
        
        <cfcatch type="any">
            <cfif lcase(URL.empSearch) EQ "henderson">
                <cfset queryAddRow(employeeResults)>
                <cfset querySetCell(employeeResults, "uid", "mhenderson")>
                <cfset querySetCell(employeeResults, "cn", "Marcus Henderson")>
                <cfset querySetCell(employeeResults, "title", "Zone-B Main Catchment Supervisor")>
                <cfset querySetCell(employeeResults, "radio_id", "RAD-ZONEB-09")>
                <cfset querySetCell(employeeResults, "photo_id", "64")>
            <cfelseif lcase(URL.empSearch) EQ "smith">
                <cfset queryAddRow(employeeResults)>
                <cfset querySetCell(employeeResults, "uid", "jsmith")>
                <cfset querySetCell(employeeResults, "cn", "John Smith")>
                <cfset querySetCell(employeeResults, "title", "Zone-C SCADA Systems Analyst")>
                <cfset querySetCell(employeeResults, "radio_id", "RAD-ZONEC-14")>
                <cfset querySetCell(employeeResults, "photo_id", "65")>
            </cfif>
        </cfcatch>
    </cftry>
</cfif>

<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#EAEAEA">
    <tr>
        <td width="15"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="15" height="1" style="display:block;" /></td>
        
        <td valign="top" bgcolor="#FFFFFF" style="padding: 15px; border-left: 1px solid #CCCCCC; border-right: 1px solid #CCCCCC;">
            
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border: 3px solid #002855;">
                <tr>
                    <td bgcolor="#000000" align="center" style="position: relative;">
                        <a id="carouselAnchorWrapper" href="/legacy-intranet/news-detail.cfm?id=10">
                            <img id="nexusLegacyCarousel" src="https://picsum.photos/id/16/900/250" width="100%" height="250" style="display: block; opacity: 0.9; border:0;" />
                        </a>
                        
                        <div style="position: absolute; bottom: 0px; left: 0px; width: 100%; background-color: rgba(0,40,85,0.75); padding: 8px 0px; text-align: left;">
                            <span style="margin-left: 20px; font-family: Arial; font-size: 14px; color: #FFFFFF; font-weight: bold;" id="carouselCaptionLabel">
                                Nexus Facility Security Perimeter Sync Logs Active [Slide 1/3]
                            </span>
                        </div>

                        <script type="text/javascript">
                            var carouselImages = [
                                "https://picsum.photos/id/16/900/250",
                                "https://picsum.photos/id/26/900/250",
                                "https://picsum.photos/id/43/900/250"
                            ];
                            var carouselCaptions = [
                                "Nexus Facility Security Perimeter Sync Logs Active [Slide 1/3]",
                                "Primary Filtration Beds Undergoing Quarterly Flow Inversion Checks [Slide 2/3]",
                                "Annual Operations Strategy Summit Staged at Corporate Headquarters [Slide 3/3]"
                            ];
                            var carouselLinks = [
                                "/legacy-intranet/news-detail.cfm?id=10",
                                "/legacy-intranet/policies/index.cfm?sec=safety",
                                "/legacy-intranet/news-category.cfm?cat=internal"
                            ];
                            var currentCarouselIndex = 0;

                            setInterval(function() {
                                currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
                                document.getElementById('nexusLegacyCarousel').src = carouselImages[currentCarouselIndex];
                                document.getElementById('carouselCaptionLabel').innerHTML = carouselCaptions[currentCarouselIndex];
                                document.getElementById('carouselAnchorWrapper').href = carouselLinks[currentCarouselIndex];
                            }, 4000);
                        </script>
                    </td>
                </tr>
            </table>

            <table width="100%" border="0" cellpadding="4" cellspacing="0" bgcolor="#D9EDF7" style="border: 1px solid #BCE8F1; margin-bottom: 15px;">
                <tr>
                    <td valign="middle">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="8" height="1" align="left" />
                        <font face="Geneva, Arial" size="2" color="#31708F">
                            <strong>⚠️ SCADA Network Maintenance Window:</strong> All pipeline manual switches are frozen until Sunday morning sync checks complete. See <a href="/legacy-intranet/policies/index.cfm?sec=scada" style="color:#31708F; font-weight:bold;">SEC-09 Protocols</a>.
                        </font>
                    </td>
                </tr>
            </table>

            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td valign="top" width="65%">
                        <font face="Arial, Helvetica, sans-serif" color="#002855" size="5">
                            <strong>Nexus Operational Dispatch</strong>
                        </font>
                        <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="12" style="display:block;" /><br>
                        <hr size="2" color="#002855">
                        <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="10" style="display:block;" />

                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td valign="top">
                                    <a href="/legacy-intranet/news-detail.cfm?id=10"><img src="https://picsum.photos/id/10/150/100" align="left" width="150" height="100" border="1" style="border-color: #666666;" /></a>
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="18" height="1" align="left" />
                                    
                                    <font face="Arial" size="3" color="#002855"><strong><a href="/legacy-intranet/news-detail.cfm?id=10" style="color:#002855; text-decoration:none;">Catchment Infrastructure Upgrades Authorized for Zone C</a></strong></font><br>
                                    <font face="Arial" size="1" color="#888888">Posted by: Executive Operations | 10-May-2015</font>
                                    <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="8" style="display:block;" />
                                    
                                    <p style="margin:0px; padding:0px; line-height: 135%;"><font face="Arial" size="2" color="#333333">
                                        The Board of Directors has cleared funding for the automated telemetry upgrade phase across the primary Zone C spillway channels. Field teams will begin mounting remote sensor arrays starting next Monday morning. <a href="/legacy-intranet/news-detail.cfm?id=10" style="color:#FF8200; font-size:11px;">Read Full Log &raquo;</a>
                                    </font></p>
                                </td>
                            </tr>
                        </table>

                        <br><br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="15" style="display:block;" />

                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td valign="top">
                                    <a href="/legacy-intranet/news-detail.cfm?id=11"><img src="https://picsum.photos/id/11/150/100" align="left" width="150" height="100" border="1" style="border-color: #666666;" /></a>
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="18" height="1" align="left" />
                                    
                                    <font face="Arial" size="3" color="#002855"><strong><a href="/legacy-intranet/news-detail.cfm?id=11" style="color:#002855; text-decoration:none;">Mandatory Chemical Handling Protocols Update</a></strong></font><br>
                                    <font face="Arial" size="1" color="#888888">Posted by: EHS Compliance Group | 04-May-2015</font>
                                    <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="8" style="display:block;" />
                                    
                                    <p style="margin:0px; padding:0px; line-height: 135%;"><font face="Arial" size="2" color="#333333">
                                        In accordance with updated state environmental security guidelines, all chemical treatment manifests must now be uploaded directly into Objective ECM via the corporate SOAP gateway prior to terminal gate release. <a href="/legacy-intranet/news-detail.cfm?id=11" style="color:#FF8200; font-size:11px;">Read Full Log &raquo;</a>
                                    </font></p>
                                </td>
                            </tr>
                        </table>

                        <br><br><br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="20" style="display:block;" />

                        <font face="Arial, Helvetica, sans-serif" color="#002855" size="4">
                            <strong>Internal Directory Lookup (Active Directory Cluster)</strong>
                        </font>
                        <hr size="1" color="#BBBBBB">
                        
                        <table width="95%" border="0" cellpadding="8" cellspacing="0" bgcolor="#F2F6FA" style="border: 1px solid #CFDBE5; margin-top: 10px;">
                            <tr>
                                <td>
                                    <form method="GET" action="/legacy-intranet/index.cfm" style="margin:0;">
                                        <font face="Arial" size="2" color="#333333">Search Directory by Surname (Try "Henderson" or "Smith"):</font><br>
                                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="4" style="display:block;" />
                                        <input type="text" name="empSearch" value="<cfoutput>#HTMLEditFormat(URL.empSearch)#</cfoutput>" size="30" style="font-family: Arial; font-size: 12px;" />
                                        <input type="submit" value="Query Active Directory" style="font-family: Arial; font-size: 12px; font-weight: bold; color:#002855;" />
                                    </form>
                                </td>
                            </tr>
                        </table>

                        <cfif len(trim(URL.empSearch))>
                            <cfif employeeResults.recordCount GT 0>
                                <table width="95%" border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; border-color: #E0E0E0; margin-top: 15px;">
                                    <tr bgcolor="#E6EDF5">
                                        <td><font face="Arial" size="2" color="#002855"><strong>Operator Photo</strong></font></td>
                                        <td><font face="Arial" size="2" color="#002855"><strong>Name (CN)</strong></font></td>
                                        <td><font face="Arial" size="2" color="#002855"><strong>Title / Department Allocation</strong></font></td>
                                        <td><font face="Arial" size="2" color="#002855"><strong>Radio Token ID</strong></font></td>
                                    </tr>
                                    <cfoutput query="employeeResults">
                                        <tr>
                                            <td align="center" width="60">
                                                <img src="https://picsum.photos/id/#photo_id#/45/45" width="45" height="45" border="1" style="border-color: ##CCCCCC;" />
                                            </td>
                                            <td><font face="Arial" size="2" color="##333333"><strong>#cn#</strong></font><br><font size="1" color="##777777">UID: #uid#</font></td>
                                            <td><font face="Arial" size="2" color="##333333">#title#</font></td>
                                            <td><font face="Courier New" size="2" color="##555555"><a href="/infrastructure-status.cfm" style="color:##555555; font-weight:bold;">#radio_id#</a></font></td>
                                        </tr>
                                    </cfoutput>
                                </table>
                            <cfelse>
                                <div style="width:95%; margin-top:15px; padding:10px; background-color:#FFF2F2; border:1px solid #CC0000; font-family:Arial; font-size:12px; color:#CC0000;">
                                    ❌ <strong>LDAP Directory Search Result:</strong> Zero matching records found in schema indices for search flag "<cfoutput>#HTMLEditFormat(URL.empSearch)#</cfoutput>".
                                </div>
                            </cfif>
                        <cfelse>
                            <div style="width:95%; margin-top:15px; padding:10px; background-color:#FAFAFA; border:1px solid #EEEEEE; font-family:Arial; font-size:11px; color:#777777; font-style:italic;">
                                Input a target directory selector query above to pull active metadata blocks from the corporate authentication catalog.
                            </div>
                        </cfif>
                    </td>

                    <td width="4%"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="25" height="1" style="display:block;" /></td>

                    <td valign="top" width="31%">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="46" style="display:block;" />

                        <table width="100%" border="0" cellpadding="12" cellspacing="0" bgcolor="#FFFFCC" style="border: 1px dashed #D4C34D; margin-bottom: 20px;">
                            <tr>
                                <td>
                                    <img src="https://picsum.photos/id/60/30/30" align="left" style="margin-right: 10px;" />
                                    <font face="Arial" size="3" color="#A04000"><strong>Operations Noticeboard</strong></font>
                                    <hr size="1" color="#D4C34D" style="margin-top: 5px; margin-bottom: 8px;">
                                    
                                    <ul style="margin: 0; padding-left: 18px; font-family: Arial; font-size: 11px; color: #554400; line-height: 140%;">
                                        <li style="margin-bottom: 8px;">
                                            <strong>IT System Alert:</strong> ColdFusion server patch deployment scheduled this Friday. See active <a href="/legacy-intranet/it-services.cfm" style="color:#A04000; font-weight:bold;">Status Outage Board</a>.
                                        </li>
                                        <li style="margin-bottom: 8px;">
                                            <strong>Valve Maintenance:</strong> Main bypass valve on Conduit #4 requires calibration. Review <a href="/infrastructure-status.cfm" style="color:#A04000; font-weight:bold;">SCADA Monitor Logs</a>.
                                        </li>
                                        <li style="margin-bottom: 8px;">
                                            <strong>Lost Keycard:</strong> A security card was found near Zone B lockers. Consult <a href="/legacy-intranet/policies/index.cfm?sec=access" style="color:#A04000; font-weight:bold;">SEC-04 Guide</a>.
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" border="0" cellpadding="10" cellspacing="1" bgcolor="#CCCCCC">
                            <tr>
                                <td bgcolor="#F9F9F9">
                                    <font face="Arial" size="2" color="#444444"><strong>Active Telemetry Context</strong></font>
                                    <hr size="1" color="#EAEAEA" style="margin-top: 4px; margin-bottom: 8px;">
                                    <p style="margin: 0; font-family: Arial; font-size: 11px; color: #666666; line-height: 150%;">
                                        - Active Database Pipes: <strong>14</strong><br>
                                        - Gateway Status: <font color="green"><strong>CONNECTED</strong></font><br>
                                        - Local Token Buffer: 100% capacity
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>

        <td width="15"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="15" height="1" style="display:block;" /></td>
    </tr>
</table>

<cfinclude template="includes/footer.cfm">
