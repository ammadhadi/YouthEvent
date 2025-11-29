var userModal;
var user = null;
var baseURL = "./api";
let allDataList = [];
let filteredDataList = [];
let page = 1;
let pageSize = 5;
let sortBy = "name";
let sortDir = "asc";
let allEventDataList = [];
let filteredEventDataList = [];
let allCommentDataList = [];
let filteredCommentDataList = [];
let allAuthorDataList = [];
let filteredAuthorDataList = [];

document.addEventListener('DOMContentLoaded', function () {
    
    userModal = document.getElementById("userModal");

    userLoginToggle();

    if (user != null) {
        loadAllContactSubmissions();
        loadAllEvents();
        loadAllComments();
        loadAllAuthors();
    }

    $("#ContactSubmissionListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredDataList = allDataList.filter(ev =>
            ev.fullname.toLowerCase().includes(q) ||
            ev.email.toLowerCase().includes(q) ||
            ev.phone.toLowerCase().includes(q) ||
            ev.content.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredDataList, "contactSubmissionTableBody");
        renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
    });

    $("#contactSubmissionTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredDataList, "contactSubmissionTableBody");
        renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
    });

    $("#eventListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();
        
        filteredEventDataList = allEventDataList.filter(ev =>
            ev.category.toLowerCase().includes(q) ||
            ev.title.toLowerCase().includes(q) ||
            ev.description.toLowerCase().includes(q) ||
            ev.location.toLowerCase().includes(q) ||
            ev.eventDate.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredEventDataList, "eventTableBody");
        renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
    });

    $("#eventTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredEventDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredEventDataList, "eventTableBody");
        renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
    });

    $("#commentListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredCommentDataList = allCommentDataList.filter(ev =>
            ev.author.toLowerCase().includes(q) ||
            ev.content.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredCommentDataList, "commentTableBody");
        renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
    });

    $("#commentTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredCommentDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredCommentDataList, "commentTableBody");
        renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
    });

    $("#authorListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredAuthorDataList = allAuthorDataList.filter(ev =>
            ev.fullname.toLowerCase().includes(q) ||
            ev.email.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredAuthorDataList, "authorTableBody");
        renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
    });

    $("#authorTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredAuthorDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredAuthorDataList, "authorTableBody");
        renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
    });

});
function userLoginToggle() {
    
    user = JSON.parse(localStorage.getItem("userSession"));
    
    if (user != null) {
        userModal.close();
        $(".loginMenuText").text(user.fullname + " | Logout");
        $(".loginSubMenu").children("li").removeClass("hidden");
    } else {
        userModal.showModal();
        $(".loginSubMenu").children("li").addClass("hidden");
    }
}

function userLogin() {

    let id = $("#userId").val();
    let fullname = $("#userName").val();

    debugger;
    if ((id == null || id == 0 || id == "") && (fullname != null && fullname != "")) {

        let postData = JSON.stringify(
            {
                "id": null,
                "fullname": fullname,
                "token": null
            });

        $.ajax({
            url: baseURL + "/Auth",
            method: "POST",
            contentType: "application/json",
            data: postData,
            success: function (res) {
                localStorage.setItem("userSession", JSON.stringify(res));
                user = res;
                alert("Successfully Login");

                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        alert("Please enter the login name");
    }

}

function ContactSubmission() {
    
    let fullname = $("#contact_FullName").val();
    let email = $("#contact_Email").val();
    let content = $("#contact_Content").val();
    let phone = $("#contact_Phone").val();
    
    debugger;
    if ((fullname != null && fullname != "") && (email != null && email != "") && (content != null && content != "")) {

        let postData = JSON.stringify(
            {
                "id": null,
                "fullname": fullname,
                "email": email,
                "phone": phone,
                "content": content
            }
        );

        $.ajax({
            url: baseURL + "/Messages",
            method: "POST",
            contentType: "application/json",
            data: postData,
            success: function (res) {
                alert("Thank you! Your message has been sent. We will back to you soon.");
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        alert("Following fields are mandatory to submit contact form. \n - Full Name \n - Email \n - Content");
    }

}

function EventSubmission() {

    let fullname = $("#contact_FullName").val();
    let email = $("#contact_Email").val();
    let content = $("#contact_Content").val();
    let phone = $("#contact_Phone").val();

    let postData = JSON.stringify(
        {
            "id": null,
            "category": "Second Event Category",
            "title": "Second Event Category Title",
            "description": "Second Event Description",
            "location": "Second Event Location",
            "eventDate": new Date(),
            "imageUrls": "https://etools.atlassian.net/s/a1kzh2/b/0/f2f2fcf95737f561da7e04397f09bd5d/_/jira-logo-scaled.png",
            "organizer": {
                "id": null,
                "fullname": "Second Event Organizer",
                "email": "second_event_organizer@email.com",
                "imageUrl": "http://localhost/eNDIS/Images/eNDIS-logo.png",
            },
            "comments": [
                {
                    "id": null,
                    "eventId": 1,
                    "author": "Second Event Author",
                    "content": "Second Event Content"
                }
            ],
            "images": [
                "http://localhost/eNDIS/Images/eNDIS-logo.png",
                "https://etools.atlassian.net/s/a1kzh2/b/0/f2f2fcf95737f561da7e04397f09bd5d/_/jira-logo-scaled.png"
            ]
        }
    );

    debugger;
    //if ((fullname != null && fullname != "") && (email != null && email != "") && (content != null && content != "")) {

        //let postData = JSON.stringify(
        //    {
        //        "id": null,
        //        "category": "First Event Main Category",
        //        "title": "First Event Main Category Title",
        //        "description": "First Event Main Category Description",
        //        "location": "First Event Main Category Location",
        //        "eventDate": new Data(),
        //        "organizerId": null,
        //        "imageUrls": "http://localhost/eNDIS/Images/eNDIS-logo.png",
        //        "organizer": {
        //            "id": null,
        //            "fullname": "First Event Organizer",
        //            "email": "first_event_organizer@email.com",
        //            "imageUrl": "http://localhost/eNDIS/Images/eNDIS-logo.png",
        //            "events": [
        //                {
        //                    "id": null,
        //                    "category": "First Event Category",
        //                    "title": "First Event Category Title",
        //                    "description": "First Event Category Description",
        //                    "location": "First Event Category Location",
        //                    "eventDate": new Data(),
        //                    "organizerId": null,
        //                    "imageUrls": "http://localhost/eNDIS/Images/eNDIS-logo.png",
        //                    "organizer": {
        //                        "id": null,
        //                        "fullname": "",
        //                        "email": "",
        //                        "imageUrl": null,
        //                        "events": [
        //                            {
        //                                "id": null,
        //                                "category": "",
        //                                "title": "",
        //                                "description": "",
        //                                "location": "",
        //                                "eventDate": null,
        //                                "organizerId": null,
        //                                "imageUrls": null,
        //                                "organizer": null,
        //                                "comments": [
        //                                    {
        //                                        "id": null,
        //                                        "eventId": 1,
        //                                        "author": "",
        //                                        "content": "",
        //                                        "event": {
        //                                            "id": null,
        //                                            "category": "",
        //                                            "title": "",
        //                                            "description": "",
        //                                            "location": "",
        //                                            "eventDate": null,
        //                                            "organizerId": null,
        //                                            "imageUrls": null,
        //                                            "organizer": {
        //                                                "id": "[Max Depth Exceeded]",
        //                                                "fullname": "[Max Depth Exceeded]",
        //                                                "email": "[Max Depth Exceeded]",
        //                                                "imageUrl": "[Max Depth Exceeded]",
        //                                                "events": "[Max Depth Exceeded]"
        //                                            },
        //                                            "comments": null,
        //                                            "...": "[Additional Properties Truncated]"
        //                                        }
        //                                    }
        //                                ],
        //                                "...": "[Additional Properties Truncated]"
        //                            }
        //                        ]
        //                    },
        //                    "comments": null,
        //                    "images": null
        //                }
        //            ]
        //        },
        //        "comments": [
        //            {
        //                "id": null,
        //                "eventId": 1,
        //                "author": "First Event Author",
        //                "content": "First Event Content",
        //                "event": {
        //                    "id": null,
        //                    "category": "First Event Comment Category",
        //                    "title": "First Event Title",
        //                    "description": "First Event Description",
        //                    "location": "First Event Location",
        //                    "eventDate": new Data(),
        //                    "organizerId": null,
        //                    "imageUrls": "http://localhost/eNDIS/Images/eNDIS-logo.png",
        //                    "organizer": "First Event Organizer",
        //                    "comments": null,
        //                    "images": [
        //                        ""
        //                    ]
        //                }
        //            }
        //        ],
        //        "images": null
        //    }
        //);

        $.ajax({
            url: baseURL + "/Events",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.token
            },
            contentType: "application/json",
            data: postData,
            success: function (res) {
                alert("Your event have been submitted.");
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    //}
    //else {
    //    alert("Following fields are mandatory to submit contact form. \n - Full Name \n - Email \n - Content");
    //}

}

function loadAllContactSubmissions() {
    $("#contactSubmissionTableBody").html('<tr> <td colspan="3" class="text-center"> <span class="loading loading-spinner loading-md"></span> </td> </tr>');

    $.ajax({
        url: baseURL + "/Messages",
        method: "GET",
        success: function (res) {
            allDataList = res; 
            filteredDataList = res;
            renderTable(filteredDataList, "contactSubmissionTableBody");
            renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
        },
        error: function (err) {
            $("#contactSubmissionTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function renderTable(dataSet, tableBodyId) {
    let start = (page - 1) * pageSize;
    let pageData = dataSet.slice(start, start + pageSize);
    let rows = "";

    if (pageData.length == 0) {
        rows = '<tr><td colspan="3" class="text-center text-gray-500">No data found</td></tr>';
    } else {

        if (tableBodyId == "contactSubmissionTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.fullname + '</td><td>' + ev.email + '</td><td>' + ev.phone + '</td><td>' + ev.content + '</td></tr>';
            })
        }
        else if (tableBodyId == "eventTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.category + '</td><td>' + ev.title + '</td><td>' + ev.description + '</td><td>' + ev.location + '</td><td>' + new Date(ev.eventDate).toDateString() + '</td></tr>';
            });
        }
        else if (tableBodyId == "commentTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.author + '</td><td>' + ev.content + '</td></tr>';
            });
        }
        else if (tableBodyId == "authorTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.fullname + '</td><td>' + ev.email + '</td><td><img src="' + ev.imageUrl + '" alt="' + ev.fullname + '" title="' + ev.fullname + '" /></td></tr>';
            });
        }
    }

    $("#" + tableBodyId).html(rows);
}

function renderPagination(dataSet, tablePaginationId, tableBodyId) {
    let totalPages = Math.ceil(dataSet.length / pageSize);
    let html = '<div class="join">';

    for (let i = 1; i <= totalPages; i++) {
        let btnactiveClass = i == page ? "btn-active" : "";
        html += '<button onclick="goToPage(' + i + ', \'' + tableBodyId + '\', \'' + tablePaginationId + '\')" class="join-item btn ' + btnactiveClass +'"> ' + i + ' </button>';
    }

    html += '</div>';

    $("#" + tablePaginationId).html(html);
}

function goToPage(p, tableBodyId, tablePaginationId) {
    page = p;
    let dataSet = null;

    if (tableBodyId == "contactSubmissionTableBody") {
        dataSet = filteredDataList;
    }
    else if (tableBodyId == "eventTableBody") {
        dataSet = filteredEventDataList;
    }
    else if (tableBodyId == "commentTableBody") {
        dataSet = filteredCommentDataList;
    }
    else if (tableBodyId == "authorTableBody") {
        dataSet = filteredAuthorDataList;
    }

    renderTable(dataSet, tableBodyId);
    renderPagination(dataSet, tablePaginationId, tableBodyId);
}

function loadAllEvents() {
    let _category = "";
    let _title = "";
    let _description = "";
    let _location = "";
    let _searchKeyword = "";
    let eventParams = "Category=" + _category + "&Title=" + _title + "&Description=" + _description + "&Location=" + _location + "&Search=" + _searchKeyword;

    $.ajax({
        url: baseURL + "/Events?" + eventParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allEventDataList = res;
            filteredEventDataList = res;
            renderTable(filteredEventDataList, "eventTableBody");
            renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
        },
        error: function (err) {
            $("#eventTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function loadAllComments() {
    let _withRelated = "";
    let commentParams = "withRelated=" + _withRelated;

    $.ajax({
        url: baseURL + "/Comments?" + commentParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allCommentDataList = res;
            filteredCommentDataList = res;
            renderTable(filteredCommentDataList, "commentTableBody");
            renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
        },
        error: function (err) {
            $("#commentTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function loadAllAuthors() {
    let _withRelated = "";
    let authorParams = "withRelated=" + _withRelated;

    $.ajax({
        url: baseURL + "/Organizers?" + authorParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allAuthorDataList = res;
            filteredAuthorDataList = res;
            renderTable(filteredAuthorDataList, "authorTableBody");
            renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
        },
        error: function (err) {
            $("#authorTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function userLogout() {
    localStorage.removeItem("userSession");
    location.reload();
}

function sampleRequest(id, fullname) {
    debugger;
    if ((id == null || id == 0 || id == "") && (fullname != null || fullname != 0 || fullname != "")) {

        $.ajax({
            url: "/Auth",
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_TOKEN_HERE"
            },
            contentType: "application/json",
            data: JSON.stringify(
                {
                    "id": null,
                    "fullname": fullname,
                    "token": null
                }
            ),
            success: function (res) {
                console.log("Response:", res);
                debugger;
                localStorage.setItem("userSession", JSON.stringify(res));
                user = res;
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        user = JSON.parse(localStorage.getItem("userSession"));
        return user;
    }

}

