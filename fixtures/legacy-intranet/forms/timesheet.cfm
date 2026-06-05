<cfinclude template="../includes/header.cfm">

<table width="98%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
        <td valign="top">
            <font face="Arial" color="#002855" size="5"><strong>HR Self-Service: Bi-Weekly Shift Timesheet Logging</strong></font>
            <hr size="2" color="#002855">
            <br>
            
            <div style="background-color:#FFFFEE; border:1px solid #D4C34D; padding:10px; font-family:Arial; font-size:12px; color:#554400; margin-bottom:15px;">
                <strong>Submission Lock Notice:</strong> Timesheets must match assigned operational scheduling arrays exactly. Overtime hours exceeding 4.0 blocks require site supervisor authorization codes.
            </div>

            <!-- DENSE TIMESHEET ENTRY GRID FORM -->
            <form name="timesheetSubmissionGrid" method="POST" action="timesheet.cfm">
                <table width="100%" border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; border-color:#CCCCCC; font-family:Arial; font-size:12px;">
                    <tr bgcolor="#E6EDF5">
                        <td width="150"><strong>Operational Shift Day</strong></td>
                        <td width="120"><strong>Regular Hours Base</strong></td>
                        <td width="120"><strong>Overtime Premium Hours</strong></td>
                        <td><strong>Shift Allocation/Location Notes</strong></td>
                    </tr>
                    <tr>
                        <td bgcolor="#F5F5F5"><strong>Monday (Zone-B Base)</strong></td>
                        <td><input type="text" name="mon_reg" value="8.0" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="mon_ot" value="0.0" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="mon_notes" value="Nominal operations watch rotation." size="50" /></td>
                    </tr>
                    <tr>
                        <td bgcolor="#F5F5F5"><strong>Tuesday (Zone-B Base)</strong></td>
                        <td><input type="text" name="tue_reg" value="8.0" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="tue_ot" value="2.5" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="tue_notes" value="Extended logging block for spillway valve failure." size="50" /></td>
                    </tr>
                    <tr>
                        <td bgcolor="#F5F5F5"><strong>Wednesday (Zone-B Base)</strong></td>
                        <td><input type="text" name="wed_reg" value="8.0" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="wed_ot" value="0.0" size="6" style="text-align:center;" /> hrs</td>
                        <td><input type="text" name="wed_notes" value="Regular shifting parameters active." size="50" /></td>
                    </tr>
                </table>

                <!-- Hardcoded Spacer Matrix Tag -->
                <br><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="15" />
                
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="right">
                            <input type="button" value="Calculate Matrix Summary Totals" onclick="alert('Calculation Complete:\nTotal Standard Hours: 24.0\nTotal Premium Overtime Hours: 2.5\nStatus: Pending Final Processing Check');" style="padding:4px; font-family:Arial; font-size:12px;" />
                            &nbsp;&nbsp;
                            <input type="submit" value="🔒 Lock and Transmit Timesheet Ledger" style="padding:4px; font-family:Arial; font-size:12px; font-weight:bold; color:#002855;" />
                        </td>
                    </tr>
                </table>
            </form>
        </td>
    </tr>
</table>

<cfinclude template="../includes/footer.cfm">
