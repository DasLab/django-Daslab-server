
if (typeof app.fnFormatInput !== "function") {
    app.fnFormatInput = function() {
        $("label.required").css("font-weight", "bold");
        $("table").addClass("table-hover").removeClass("table-bordered table-condensed");
        $('[scope="col"]').addClass("info");

        $("a.deletelink").css("box-sizing", "border-box");
        $("input").addClass("form-control");
        $("select").addClass("form-control");
        $("textarea").addClass("form-control");
        $("span.add-on").html('<span class="glyphicon glyphicon-calendar"></span>').addClass("input-group-addon").removeClass("add-on");

        $('th > div.text > span > input[type="checkbox"]').each(function() {
            var parent = $(this).parent();
            $(this).css("display", "");
            $(this).detach().insertBefore(parent);
        });
        $('input[type="checkbox"], input[type="radio"]').each(function() {
            $(this).parent().addClass("checkbox");
            if ($(this).next().is("label")) {
                $(this).prependTo($(this).next());
            } else {
                $(this).removeClass("form-control");
                $(this).next().css("padding-left", "10px");
                $('<label></label>').insertBefore($(this));
                var elem = $(this).prev();
                $(this).next().appendTo(elem);
                $('<span class="cr"><span class="cr-icon glyphicon glyphicon-ok"></span></span>').prependTo(elem);
                $(this).prependTo(elem);
                $('<div class="checkbox"></div>').insertBefore(elem);
                elem.appendTo(elem.prev());
            }
        });

        $('p.file-upload > a').each(function() {
            $(this).replaceWith('<div class="form-inline"><label>Current:&nbsp;&nbsp;</label><input class="form-control" disabled="disabled" style="cursor:text;" value="' + $(this).attr("href") + '">&nbsp;&nbsp;<a href="'+ replace_path($(this).attr("href")) + '" class="btn btn-default" target="_blank"><span class="glyphicon glyphicon-cloud-download"></span>&nbsp;&nbsp;View&nbsp;&nbsp;</a></div>');
        });
        $('.clearable-file-input').each(function() {
            $(this).appendTo($(this).prev());
            $(this).children().contents().filter(function () {return this.data === "Clear";}).replaceWith("&nbsp;&nbsp;<span class='glyphicon glyphicon-remove-sign'></span>&nbsp;Clear");
        });
        $('input[type="file"]').each(function() {
            $('<div class="form-inline"><label>Change:&nbsp;&nbsp;</label><input id="' + $(this).attr("id") + '_disp" class="form-control" placeholder="No file chosen" disabled="disabled" style="cursor:text;"/>&nbsp;&nbsp;<div id="' + $(this).attr("id") + '_btn" class="fileUpload btn btn-info"><span><span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;Browse&nbsp;&nbsp;</span></div>').insertAfter(this);
            $(this).detach().appendTo('#' + $(this).attr("id") + '_btn');

            $(this).on("change", function () {
                $('#' + $(this).attr("id") + '_disp').val($(this).val().replace("C:\\fakepath\\", ""));
            });
            $('.file-upload').contents().filter(function () {return this.data === "Change: " | this.data === "Currently: ";}).remove();
        });
        $('input[disabled="disabled"]').each(function() {
            $(this).width($(this).width()*2.5);
        });

        $(".toggle.descending").html('<span class="glyphicon glyphicon-chevron-up"></span>');
        $(".toggle.ascending").html('<span class="glyphicon glyphicon-chevron-down"></span>');
        $(".sortremove").html('<span class="glyphicon glyphicon-remove"></span>');
        $(".sortoptions").addClass("pull-right").removeClass("sortoptions");
        $("div.pagination-info").html("<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + $("div.pagination-info").html());
    };
}
app.fnFormatInput();

if (app.page == "backup") {
    $("#content > h2.content-title").remove();
    $("span.divider").remove();
    $("lspan").remove();

    $.ajax({
        url : "/admin/get_backup/",
        dataType: "json",
        success : function (data) {
            $("#id_news_n").html('<i>' + data.news[0] + '</i>');
            $("#id_news_s").html('<span style="color:#00f;">' + data.news[1] + '</span>');
            $("#id_member_n").html('<i>' + data.ppl[0] + '</i>');
            $("#id_member_s").html('<span style="color:#00f;">' + data.ppl[1] + '</span>');
            $("#id_pub_n").html('<i>' + data.pub[0] + '</i>');
            $("#id_pub_s").html('<span style="color:#00f;">' + data.pub[1] + '</span>');
            $("#id_rot_n").html('<i>' + data.roton[0] + '</i>');
            $("#id_rot_s").html('<span style="color:#00f;">' + data.roton[1] + '</span>');
            $("#id_spe_n").html('<i>' + data.arxiv[0] + '</i>');
            $("#id_spe_s").html('<span style="color:#00f;">' + data.arxiv[1] + '</span>');

            $("#id_mysql_s").html('<span style="color:#00f;">' + data.backup.mysql[1] + '</span>');
            $("#id_static_s").html('<span style="color:#00f;">' + data.backup.data[1] + '</span>');
            $("#id_apache_s").html('<span style="color:#00f;">' + data.backup.apache[1] + '</span>');
            $("#id_config_s").html('<span style="color:#00f;">' + data.backup.config[1] + '</span>');
            $("#id_mysql_p").html($("#id_mysql_p").html() + '<br/><code>' + data.backup.mysql[0] + '</code>');
            $("#id_static_p").html($("#id_static_p").html() + '<br/><code>' + data.backup.data[0] + '</code>');
            $("#id_apache_p").html($("#id_apache_p").html() + '<br/><code>' + data.backup.apache[0] + '</code>');
            $("#id_config_p").html($("#id_config_p").html() + '<br/><code>' + data.backup.config[0] + '</code>');

            var html = '';
            for (var i = 0; i < data.gdrive.length; i++) {
                html += '<tr><td><code>' + data.gdrive[i][0] + '</code></td><td><span class="label label-primary">' + data.gdrive[i][2] + '</span></td><td><span style="color:#00f;">' + data.gdrive[i][1] + '</span></td></tr>';
            }
            html += '<tr><td colspan="3" style="padding: 0px;"></td></tr>';
            $("#gdrive_list").html(html);

        }
    });

    $.ajax({
        url : "/admin/get_sys/",
        dataType: "json",
        success : function (data) {
            var drive_used = parseFloat(data.drive[0]), drive_free = parseFloat(data.drive[1]), drive_total = parseFloat(data.drive[2]);
            $("#id_drive_space > div > div.progress-bar-success").css("width", (drive_free / drive_total * 100).toString() + '%' ).html(drive_free + ' G');
            $("#id_drive_space > div > div.progress-bar-danger").css("width", (100 - drive_free / drive_total * 100).toString() + '%' ).html(drive_used + ' G');
            $("#id_disk_space > div > div.progress-bar-success").css("width", (parseFloat(data.disk[0]) / (parseFloat(data.disk[0]) + parseFloat(data.disk[1])) * 100).toString() + '%' ).html(data.disk[0]);
            $("#id_disk_space > div > div.progress-bar-danger").css("width", (parseFloat(data.disk[1]) / (parseFloat(data.disk[0]) + parseFloat(data.disk[1])) * 100).toString() + '%' ).html(data.disk[1]);
        }
    });


    $("#id_time_backup, #id_day_backup").on("change", function() {
        var time = $("#id_time_backup").val();
        var backup = new Date(Date.UTC(2000, 0, parseInt($("#id_day_backup").val()) + 2, time.split(':')[0], time.split(':')[1], 0));
        $("#time_backup_pdt").html(backup.toLocaleTimeString());
        $("#day_backup_pdt").html(weekdayNames[backup.getDay()]);
    });
    $("#id_time_upload, #id_day_upload").on("change", function() {
        var time = $("#id_time_upload").val();
        var backup = new Date(Date.UTC(2000, 0, parseInt($("#id_day_upload").val()) + 2, time.split(':')[0], time.split(':')[1], 0));
        $("#time_upload_pdt").html(backup.toLocaleTimeString());
        $("#day_upload_pdt").html(weekdayNames[backup.getDay()]);
    });

    if (!$("#id_time_backup").val() || !$("#id_day_backup").val()) {
        $("#banner_backup").removeClass("alert-success").addClass("alert-danger");
        $("#sign_backup").removeClass("glyphicon-ok-sign").addClass("glyphicon-remove-sign");
    }
    if (!$("#id_time_upload").val() || !$("#id_day_upload").val()) {
        $("#banner_sync").removeClass("alert-success").addClass("alert-danger");
        $("#sign_sync").removeClass("glyphicon-ok-sign").addClass("glyphicon-remove-sign");
    }

    $("#id_time_backup").trigger("change");
    $("#id_time_upload").trigger("change");
    $("#modal_backup").html('On <span class="label label-primary">' + $("#id_time_backup").val() + '</span> every <span class="label label-inverse">' + weekdayNames[$("#id_day_backup").val()] + '</span> (UTC).');
    $("#modal_upload").html('On <span class="label label-primary">' + $("#id_time_upload").val() + '</span> every <span class="label label-inverse">' + weekdayNames[$("#id_day_upload").val()] + '</span> (UTC).');

} else if (app.page == "bot") {
    $("#id_day_meeting").prop("disabled", true);

    $("#id_is_slack").on("change", function() {
        if ($(this).is(":checked")) {
            $("#id_is_bday").prop("disabled", false);
            $("input[id^='id_is_admin'").prop("disabled", false);
            $("input[id^='id_is_duty'").prop("disabled", false);
            $("input[id^='id_is_user'").prop("disabled", false);
            $("select[id^='id_day_duty'").prop("disabled", false);

            if (!$("#id_is_version").is(":checked")) {
                $("#id_is_admin_version").prop("disabled", true);
            }
            if (!$("#id_is_report").is(":checked")) {
                $("#id_is_admin_report").prop("disabled", true);
            }
            if (!$("#id_is_bday").is(":checked")) {
                $("#id_is_duty_bday").prop("disabled", true);
            }
            $("select[id^='id_day_reminder']").prop("disabled", false);
        } else {
            $("#id_is_bday").prop("disabled", true);
            $("input[id^='id_is_admin'").prop("disabled", true);
            $("input[id^='id_is_duty'").prop("disabled", true);
            $("input[id^='id_is_user'").prop("disabled", true);
            $("select[id^='id_day_duty'").prop("disabled", true);

            if (!$("#id_is_flash_slide").is(":checked")) {
                $("select[id^='id_day_reminder']").prop("disabled", true);
            } else {
                $("select[id^='id_day_reminder']").prop("disabled", false);
            }
        }
    });

    $("#id_is_cache").on("change", function() {
        if ($(this).is(":checked")) {
            $("select[id^='id_cache'").prop("disabled", false);
        } else {
            $("select[id^='id_cache'").prop("disabled", true);
        }
    });

    $("#id_is_version").on("change", function() {
        if ($(this).is(":checked")) {
            if ($("#id_is_slack").is(":checked")) {
                $("#id_is_admin_version").prop("disabled", false);
            }
        } else {
            $("#id_is_admin_version").prop("disabled", true);
        }
    });
    $("#id_is_report").on("change", function() {
        if ($(this).is(":checked")) {
            if ($("#id_is_slack").is(":checked")) {
                $("#id_is_admin_report").prop("disabled", false);
            }
        } else {
            $("#id_is_admin_report").prop("disabled", true);
        }
    });

    $("#id_is_bday").on("change", function() {
        if ($(this).is(":checked")) {
            if ($("#id_is_slack").is(":checked")) {
                $("#id_is_duty_bday").prop("disabled", false);
            }
        } else {
            $("#id_is_duty_bday").prop("disabled", true);
        }
    });

    $("#id_is_flash_slide").on("change", function() {
        if ($(this).is(":checked") || $("#id_is_slack").is(":checked")) {
            $("select[id^='id_day_reminder']").prop("disabled", false);
        } else {
            $("select[id^='id_day_reminder']").prop("disabled", true);
        }
    });
} else if (app.page == "export") {
    $("#id_text_type").on("change", function() {
        if ($(this).val() == "0") {
            $("#id_bold_author, #id_bold_year, #id_underline_title, #id_italic_journal, #id_bold_volume").attr("disabled", "disabled");
            $("[class^=item_]").css({"font-weight":"normal", "font-style":"normal", "text-decoration":"none"});
        } else {
            $("#id_bold_author, #id_bold_year, #id_underline_title, #id_italic_journal, #id_bold_volume").removeAttr("disabled");
            $("#id_bold_author, #id_bold_year, #id_underline_title, #id_italic_journal, #id_bold_volume").trigger("change");
        }
    });

    $("#id_sort_order").on("change", function() {
        if ($(this).val() == "0") {
            $("#prv_item_1").detach().insertAfter($("#prv_item_3"));
            $("#prv_item_2").detach().insertAfter($("#prv_item_3"));
            $("[id^=id_number_order]").trigger("change");
        } else {
            $("#prv_item_1").detach().insertBefore($("#prv_item_3"));
            $("#prv_item_2").detach().insertBefore($("#prv_item_3"));
            $("[id^=id_number_order]").trigger("change");

        }
    });
    $("#id_number_order").on("change", function() {
        if ($(this).val() == "0") {
            var list = $("[id^=prv_item_]>span.item_num");
            for (var i = 0; i < list.length; i++) {
                $(list[i]).html((i + 1).toString() + '.');
            }
        } else {
            var list = $("[id^=prv_item_]>span.item_num");
            for (var i = 0; i < list.length; i++) {
                $(list[i]).html((list.length - i).toString() + '.');
            }
        }
    });
    $("#id_order_number").on("change", function() {
        $(".item_num").toggle();
        $("[id^=id_number_order]").trigger("change");
    });
    $("[id^=id_number_order]").trigger("change");

    $(".item_das").css("font-weight", "bold");
    $("#id_bold_author").on("change", function() {
        if ($("#id_bold_author").is(":checked")) {
            $(".item_das").css("font-weight", "bold");
        } else {
            $(".item_das").css("font-weight", "normal");
        }
    });
    $(".item_year").css("font-weight", "bold");
    $("#id_bold_year").on("change", function() {
        if ($("#id_bold_year").is(":checked")) {
            $(".item_year").css("font-weight", "bold");
        } else {
            $(".item_year").css("font-weight", "normal");
        }
    });
    $(".item_quote").css("display", "inline-block");
    $("#id_quote_title").on("change", function() {
        if ($("#id_quote_title").is(":checked")) {
            $(".item_quote").css("display", "inline-block");
        } else {
            $(".item_quote").css("display", "none");
        }
    });
    $(".item_title").css("text-decoration", "underline");
    $("#id_underline_title").on("change", function() {
        if ($("#id_underline_title").is(":checked")) {
            $(".item_title").css("text-decoration", "underline");
        } else {
            $(".item_title").css("text-decoration", "none");
        }
    });
    $(".item_journal").css("font-style", "italic");
    $("#id_italic_journal").on("change", function() {
        if ($("#id_italic_journal").is(":checked")) {
            $(".item_journal").css("font-style", "italic");
        } else {
            $(".item_journal").css("font-style", "normal");
        }
    });
    $(".item_volume").css("font-weight", "bold");
    $("#id_bold_volume").on("change", function() {
        if ($("#id_bold_volume").is(":checked")) {
            $(".item_volume").css("font-weight", "bold");
        } else {
            $(".item_volume").css("font-weight", "normal");
        }
    });
    $("#id_double_space").on("change", function() {
        if ($("#id_double_space").is(":checked")) {
            $("[id^=prv_item_]").each( function() {
                $('<br class="item_br"/>').insertAfter($(this));
            });
        } else {
            $(".item_br").remove();
        }
    });

    $("#export_save, #export_view").on("click", function() { $(window).unbind(); });
}