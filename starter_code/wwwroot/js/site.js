var userModal;
var user = null;
var baseURL = "./api";
let allDataList = [];   // full dataset from API
let filteredDataList = [];
let page = 1;
let pageSize = 5;
let sortBy = "name";
let sortDir = "asc";

document.addEventListener('DOMContentLoaded', function () {
    
    userModal = document.getElementById("userModal");

    userLoginToggle();
    loadAllContactSubmissions();

    $("#ContactSubmissionListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredDataList = allDataList.filter(ev =>
            ev.fullname.toLowerCase().includes(q) ||
            ev.email.toLowerCase().includes(q) ||
            ev.phone.toLowerCase().includes(q) ||
            ev.content.toLowerCase().includes(q)
        );

        page = 1;
        renderTable();
        renderPagination();
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
        renderTable();
        renderPagination();
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
            renderTable();
            renderPagination();
        },
        error: function () {
            $("#contactSubmissionTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function renderTable() {
    let start = (page - 1) * pageSize;
    let pageData = filteredDataList.slice(start, start + pageSize);
    let rows = "";

    if (pageData.length == 0) {
        rows = '<tr><td colspan="3" class="text-center text-gray-500">No data found</td></tr>';
    } else {
        pageData.forEach(ev => {
            rows += '<tr><td>' + ev.fullname + '</td><td>' + ev.email + '</td><td>' + ev.phone + '</td><td>' + ev.content + '</td></tr>';
        });
    }

    $("#contactSubmissionTableBody").html(rows);
}

function renderPagination() {
    let totalPages = Math.ceil(filteredDataList.length / pageSize);
    let html = '<div class="join">';

    for (let i = 1; i <= totalPages; i++) {
        let btnactiveClass = i == page ? "btn-active" : "";
        html += '<button onclick="goToPage(' + i + ')" class="join-item btn ' + btnactiveClass +'"> ' + i + ' </button>';
    }

    html += '</div>';

    $("#contactSubmissionTablePagination").html(html);
}

function goToPage(p) {
    page = p;
    renderTable();
    renderPagination();
}

function loadAllEvents() {
    //$("#contactSubmissionTableBody").html('<tr> <td colspan="3" class="text-center"> <span class="loading loading-spinner loading-md"></span> </td> </tr>');

    //let _category = "First Event Category";
    //let _title = "First Event Category Title";
    //let _description = "First Event Description";
    //let _location = "First Event Location";
    //let _searchKeyword = "Event";

    let _category = " ";
    let _title = " ";
    let _description = " ";
    let _location = " ";
    let _searchKeyword = " ";
    debugger
    let eventParams = "Category=" + _category + "&Title=" + _title + "&Description=" + _description + "&Location=" + _location + "&Search=" + _searchKeyword;

    $.ajax({
        //url: baseURL + "/Events?Category=&Title=&Description=&Location=&Search=",
        url: baseURL + "/Events?" + eventParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            debugger
            console.log(res);
        },
        error: function (err) {
            console.log(err);
            //$("#contactSubmissionTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
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

