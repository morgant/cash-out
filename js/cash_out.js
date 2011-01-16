function CalculateBalances() {
	// sum up the cash balance
	var cashTotal = 0;
	cashTotal = Number($('#hundreds').val()) * 100.00;
	cashTotal += Number($('#fifties').val()) * 50.00;
	cashTotal += Number($('#twenties').val()) * 20.00;
	cashTotal += Number($('#tens').val()) * 10.00;
	cashTotal += Number($('#fives').val()) * 5.00;
	cashTotal += Number($('#ones').val());
	cashTotal += Number($('#quarters').val()) * 0.25;
	cashTotal += Number($('#dimes').val()) * 0.1;
	cashTotal += Number($('#nickels').val()) * 0.05;
	cashTotal += Number($('#pennies').val()) * 0.01;
	
	$('#cashBalance').val(cashTotal.toFixed(2)).removeClass("over under even");
	if ( (cashTotal - Number($("#openingBalance").val())) < 0 )
	{
		$("#cashBalance").addClass("under");
	}
	else if ( (cashTotal - Number($("#openingBalance").val())) == 0 )
	{
		$("#cashBalance").addClass("even");
	}
	else
	{
		$("#cashBalance").addClass("over");
	}
	
	// sum up the checks balance
	var checksTotal = Number(0);
	$("li.check > input").each(function () { checksTotal += Number($(this).val());  });
	$("#checksBalance").val(checksTotal.toFixed(2));
	
	// update the delta
	var delta = 0;
	delta = Number($('#cashBalance').val()) - Number($('#openingBalance').val()) + Number($("#checksBalance").val());
	$('#balanceDelta').val(delta.toFixed(2)).removeClass("over under even");
	if ( (delta - Number($("#checksBalance").val())) < 0 )
	{
		$("#balanceDelta").addClass("under");
	}
	else if ( (delta - Number($("#checksBalance").val())) == 0 )
	{
		$("#balanceDelta").addClass("even");
	}
	else
	{
		$("#balanceDelta").addClass("over");
	}
}

$(document).ready(function() {
	// display the date
	var today = new Date();
	$("#date").text(today.toLocaleDateString());

	// update calculations upon leaving a field
	$("#hundreds, #fifties, #twenties, #tens, #fives, #ones, #quarters, #dimes, #nickels, #pennies, #openingBalance, li.check > input").blur(CalculateBalances);
	
	// add check button action
	$("#addCheck").click(function() {
		var checkNumber = $("#checksList").children().length + 1;
		var newCheckHTML = "<li class=\"check\"><label for=\"check" + checkNumber + "\">Check Amount</label><input id=\"check" + checkNumber + "\" /></li>\n";
		
		// insert the html
		if ( checkNumber == 1 )
		{
			$("#checksList").html(newCheckHTML);
		}
		else
		{
			$("#checksList").children().last().after(newCheckHTML);
		}
		
		// update calculations upon leaving the new check field
		$("#check" + checkNumber).blur(CalculateBalances);
		$("#checksBalance, label[for=checksBalance]").show();
	});
		
	// print button action
	$("#print").click(function() {
		CalculateBalances();
		window.print();
	});

	// email button action
	$("#email").click(function() {
		CalculateBalances();
		
		// prompt for the email address to send to
		var recipient = '';
		do {
			recipient = prompt("Email to:");
		} while ( !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(recipient) );
		
		// build the message content
		var subject = "Cash Out for " + $("#date").text();
		var body = subject + ":\n\nCASH:\n";
		body += "\n$100 x " + Number($('#hundreds').val());
		body += "\n $50 x " + Number($('#fifties').val());
		body += "\n $20 x " + Number($('#twenties').val());
		body += "\n $10 x " + Number($('#tens').val());
		body += "\n  $5 x " + Number($('#fives').val());
		body += "\n  $1 x " + Number($('#ones').val());
		body += "\n 25¢ x " + Number($('#quarters').val());
		body += "\n 10¢ x " + Number($('#dimes').val());
		body += "\n  5¢ x " + Number($('#nickels').val());
		body += "\n  1¢ x " + Number($('#pennies').val());
		body += "\n\nCHECKS:\n";
		$("li.check > input").each(function () { body += "\n$" + Number($(this).val()).toFixed(2); });
		body += "\n\nTOTALS:\n";
		body += "\nOpening Balance: $" + Number($('#openingBalance').val()).toFixed(2);
		body += "\n   Cash Balance: $" + Number($('#cashBalance').val()).toFixed(2);
		body += "\n Checks Balance: $" + Number($('#checksBalance').val()).toFixed(2);
		body += "\n        DEPOSIT: $" + Number($('#balanceDelta').val()).toFixed(2);
		
		window.location.replace("mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
	});
});

