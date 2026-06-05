<cfinclude template="../includes/header.cfm">

<cfparam name="URL.sec" default="safety">

<table width="98%" border="0" align="center" cellpadding="5" cellspacing="0" style="margin-top:15px;">
    <tr>
        <!-- ======================================================= -->
        <!-- LEFT SIDEBAR: NESTED CATEGORY DOCUMENT PARSE TREE (30%)  -->
        <!-- ======================================================= -->
        <td valign="top" width="30%" bgcolor="#F4F4F4" style="border: 1px solid #D7D7D7; padding: 15px;">
            <font face="Arial" size="3" color="#002855"><strong>Corporate Policy Manuals</strong></font>
            <hr size="1" color="#002855" style="margin-bottom:12px;">

            <!-- Category Folder Block 1 -->
            <div style="font-family: Arial; font-size: 12px; font-weight: bold; color: #333;">
                📁 Environment, Health & Safety (EHS)
            </div>
            <ul style="margin: 5px 0 15px 0; padding-left: 20px; font-family: Arial; font-size: 11px; line-height: 160%;">
                <li><a href="index.cfm?sec=safety" style="color: #002855; text-decoration:none;<cfif URL.sec EQ 'safety'>font-weight:bold;color:#FF8200;</cfif>">EHS-01: Chemical Handling Protocols</a></li>
                <li><a href="index.cfm?sec=ppe" style="color: #002855; text-decoration:none;<cfif URL.sec EQ 'ppe'>font-weight:bold;color:#FF8200;</cfif>">EHS-02: Protective Equipment Mandates</a></li>
            </ul>

            <!-- Category Folder Block 2 -->
            <div style="font-family: Arial; font-size: 12px; font-weight: bold; color: #333;">
                📁 Facility Security Operations
            </div>
            <ul style="margin: 5px 0 15px 0; padding-left: 20px; font-family: Arial; font-size: 11px; line-height: 160%;">
                <li><a href="index.cfm?sec=access" style="color: #002855; text-decoration:none;<cfif URL.sec EQ 'access'>font-weight:bold;color:#FF8200;</cfif>">SEC-04: Proximity Keycard Controls</a></li>
                <li><a href="index.cfm?sec=scada" style="color: #002855; text-decoration:none;<cfif URL.sec EQ 'scada'>font-weight:bold;color:#FF8200;</cfif>">SEC-09: SCADA Air-Gap Isolations</a></li>
            </ul>
        </td>

        <!-- Structural Content Margin Gutter -->
        <td width="2%"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="15" height="1" /></td>

        <!-- ======================================================= -->
        <!-- RIGHT VIEWPORT: ACCESSIBLE DOCUMENT VIEWER PANEL (68%)   -->
        <!-- ======================================================= -->
        <td valign="top" width="68%" style="border: 1px solid #CCCCCC; padding: 20px; background-color:#FFFFFF;">
            <cfif URL.sec EQ "safety">
                <font face="Arial" size="4" color="#002855"><strong>EHS-01: Chemical Handling Protocols & Processing Manifests</strong></font>
                <hr size="1" color="#CCCCCC"><br>
                <font face="Arial" size="2" color="#333333" style="line-height:145%;">
                    <strong>1. Core Scope Parameters</strong><br>
                    This mandate maps the operational handling layout for chlorine liquid feeds and raw purification chemistry matrices. All site operators logging container intake must sign verification stamps.<br><br>
                    <strong>2. Mixing Matrix Limits</strong><br>
                    Do not process matrix agents without verifying active containment metrics on Node-04 terminal dashboard monitors.
                </font>
            <cfelseif URL.sec EQ "ppe">
                <font face="Arial" size="4" color="#002855"><strong>EHS-02: Protective Equipment Mandates (Zone-B Allocation)</strong></font>
                <hr size="1" color="#CCCCCC"><br>
                <font face="Arial" size="2" color="#333333">
                    Mandatory high-visibility outerwear, steel-reinforced footwear, and automated atmospheric detection monitors are locked as active site entry parameters across all Zone-B containment bays.
                </font>
            <cfelse>
                <font face="Arial" size="4" color="#002855"><strong>Operational Policy Core System Node</strong></font>
                <hr size="1" color="#CCCCCC"><br>
                <font face="Arial" size="2" color="#666666">Select an internal procedural control ledger from the category list map tree to access runtime compliance files.</font>
            </cfif>
        </td>
    </tr>
</table>

<cfinclude template="../includes/footer.cfm">
