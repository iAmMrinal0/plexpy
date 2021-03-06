user_ip_table_options = {
    "destroy": true,
    "language": {
        "search": "Search: ",
        "lengthMenu":"Show _MENU_ entries per page",
        "info":"Showing _START_ to _END_ of _TOTAL_ results",
        "infoEmpty":"Showing 0 to 0 of 0 entries",
        "infoFiltered":"(filtered from _MAX_ total entries)",
        "emptyTable": "No data in table",
    },
    "stateSave": true,
    "pagingType": "bootstrap",
    "processing": false,
    "serverSide": true,
    "pageLength": 10,
    "order": [ 0, 'desc'],
    "autoWidth": false,
    "columnDefs": [
        {
            "targets": [0],
            "data":"last_seen",
            "render": function ( data, type, full ) {
                return moment(data, "X").fromNow();
            },
            "searchable": false,
            "width": "15%",
            "className": "no-wrap"
        },
        {
            "targets": [1],
            "data":"ip_address",
            "width": "15%",
            "className": "modal-control no-wrap",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData) {
                    if (isPrivateIP(cellData)) {
                        if (cellData != '') {
                            $(td).html(cellData);
                        } else {
                            $(td).html('n/a');
                        }
                    } else {
                        $(td).html('<a href="javascript:void(0)" data-toggle="modal" data-target="#ip-info-modal"><span data-toggle="ip-tooltip" data-placement="left" title="IP Address Info" id="ip-info"><i class="fa fa-map-marker"></i></span>&nbsp' + cellData +'</a>');
                    }
                } else {
                    $(td).html('n/a');
                }
            },
            "width": "15%"
        },
        {
            "targets": [2],
            "data":"play_count",
            "width": "10%",
            "className": "hidden-xs"
        },
        {
            "targets": [3],
            "data":"platform",
            "width": "15%",
            "className": "hidden-xs"
        },
        {
            "targets": [4],
            "data":"last_watched",
            "width": "30%",
            "className": "hidden-sm hidden-xs"
        }
    ],
    "drawCallback": function (settings) {
        // Jump to top of page
        // $('html,body').scrollTop(0);
        $('#ajaxMsg').fadeOut();
    },
    "preDrawCallback": function(settings) {
        var msg = "<div class='msg'><i class='fa fa-refresh fa-spin'></i>&nbspFetching rows...</div>";
        showMsg(msg, false, false, 0)
    }
}

$('#user_ip_table').on('mouseenter', 'td.modal-control span', function () {
    $(this).tooltip();
});

$('#user_ip_table').on('click', 'td.modal-control', function () {
    var tr = $(this).parents('tr');
    var row = user_ip_table.row( tr );
    var rowData = row.data();

    function getUserLocation(ip_address) {
        if (isPrivateIP(ip_address)) {
            return "n/a"
        } else {
            $.ajax({
                url: 'get_ip_address_details',
                data: {ip_address: ip_address},
                async: true,
                complete: function(xhr, status) {
                    $("#ip-info-modal").html(xhr.responseText);
                }
            });
        }
    }

    getUserLocation(rowData['ip_address']);
});