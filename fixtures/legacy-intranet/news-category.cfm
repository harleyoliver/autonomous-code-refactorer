<cfinclude template="includes/header.cfm">

<cfsavecontent variable="soapRequestEnvelope">
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ecm="http://objective-ecm.synthetic/api/">
        <soapenv:Header/>
        <soapenv:Body>
            <ecm:FetchDocumentStream>
                <ecm:CategorySelector><cfoutput>#URL.cat#</cfoutput></ecm:CategorySelector>
                <ecm:MaxRecords>10</ecm:MaxRecords>
            </ecm:FetchDocumentStream>
        </soapenv:Body>
    </soapenv:Envelope>
</cfsavecontent>

<cfhttp url="https://api.objective-ecm.local/services/DocumentService" method="POST" result="ecmResponse">
    <cfhttpparam type="header" name="SOAPAction" value="http://objective-ecm.synthetic/api/FetchDocumentStream">
    <cfhttpparam type="header" name="Content-Type" value="text/xml; charset=utf-8">
    <cfhttpparam type="xml" value="#trim(soapRequestEnvelope)#">
</cfhttp>

<table width="98%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
        <td valign="top">
            <font face="Arial" color="#002855" size="5"><strong>Document Stream: <cfoutput>#UCase(URL.cat)#</cfoutput></strong></font>
            <hr size="2" color="#002855">
            <br>

            <cfif NOT find("200", ecmResponse.statusCode)>
                <div style="padding: 15px; background-color: #FFEEEE; border: 1px solid #FF0000; color: #CC0000; font-family: Arial; font-size: 12px;">
                    <strong>Error:</strong> Failed to communicate with Objective ECM SOAP gateway endpoint.
                </div>
            <cfelse>
                <div style="margin-bottom: 20px; font-family: Arial; font-size: 12px; color: #666666; font-style: italic;">
                    Cached records retrieved successfully from ECM stream wrapper instance.
                </div>

                <table width="100%" border="0" cellpadding="10" cellspacing="0" style="border: 1px solid #CCCCCC; margin-bottom: 15px;">
                    <tr bgcolor="#F5F5F5">
                        <td>
                            <font face="Arial" size="3" color="#002855"><strong>DOC-9842: Operations Guidelines (Zone B Catchment)</strong></font>
                            <span style="margin-left: 20px; font-family: Arial; font-size: 11px; color: #888888;">Published: 12-Mar-2015</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <font face="Arial" size="2" color="#333333">
                                This technical log contains mandatory parameters for pipe backflow monitoring filters. All operations personnel must verify telemetry indices prior to clearing pressure gates.
                            </font>
                        </td>
                    </tr>
                </table>
            </cfif>
        </td>
    </tr>
</table>

<cfinclude template="includes/footer.cfm">
