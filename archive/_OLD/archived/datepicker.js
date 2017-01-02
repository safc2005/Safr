//Date picker function
  /*$(function() {
    $( "#datepicker" ).datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy-mm',
        onClose: function(dateText, inst) { 
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));

            //SNE: custom work to enable the pick to work with our solution
            var $thisDate = $('#datepicker').val();
            $thisDate = $thisDate.split('-');
            $year = $thisDate[0];
            $month = $thisDate[1];

            //passing the month and year selected to the reporting function
            monthReport($year, $month);
        },
        beforeShow : function(input, inst) {
            if ((datestr = $(this).val()).length > 0) {
                actDate = datestr.split('-');
                year = actDate[0];
                month = actDate[1]-1;
                $(this).datepicker('option', 'defaultDate', new Date(year, month));
                $(this).datepicker('setDate', new Date(year, month));
            }
        }
    });    
  });*/