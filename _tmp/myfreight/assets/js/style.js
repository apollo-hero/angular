$('#myTable').DataTable({
    "pagingType": "full_numbers",
    searching:false,
    ordering:false,
    language: {"lengthMenu": " _MENU_" },
    dom: '<"top>rt<"bottom"lfp><"clear">',
    "scrollY":"400px",
    "scrollCollapse": true,
    "oLanguage": {
      "oPaginate": {
        "sFirst":"<<",
        "sPrevious": "<",
        "sNext":">",
        "sLast":">>",
      },
    }

}

);