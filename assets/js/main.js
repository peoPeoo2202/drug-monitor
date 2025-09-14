let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

// Error handling function for AJAX requests
function handleAjaxError(xhr, defaultMessage) {
    let errorMessage = defaultMessage;
    
    try {
        const response = JSON.parse(xhr.responseText);
        if (response.message) {
            errorMessage = response.message;
        }
        if (response.errors && Array.isArray(response.errors)) {
            errorMessage += "\nChi tiết lỗi:\n" + response.errors.join("\n");
        }
    } catch (e) {
        // If response is not JSON, use status text
        if (xhr.statusText) {
            errorMessage += ": " + xhr.statusText;
        }
    }
    
    // Show error message
    alert("Lỗi: " + errorMessage);
    
    // Log error to console for debugging
    console.error("AJAX Error:", {
        status: xhr.status,
        statusText: xhr.statusText,
        responseText: xhr.responseText
    });
}

// Global error handler for unhandled JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    alert('Đã xảy ra lỗi JavaScript. Vui lòng làm mới trang.');
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    alert('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    e.preventDefault(); // Prevent the default browser behavior
});

$("#add_drug").submit(function(event){//on a submit event on the element with id add_drug
    event.preventDefault();//prevent default submit behaviour
    
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })

    var request = {//use a post API request to create new drug
        "url" : `https://${url}/api/drugs`,
        "method" : "POST",
        "data" : data
    }

    $.ajax(request)
        .done(function(response){
            alert(data.name + " added successfully!");
            window.location.href = "/manage";//redirects to manage after alert is closed
        })
        .fail(function(xhr, status, error){
            handleAjaxError(xhr, "Thêm thuốc thất bại");
        })
})



$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })


    var request = {//use a put API request to use data from above to replace what's on database
    "url" : `https://${url}/api/drugs/${data.id}`,
    "method" : "PUT",
    "data" : data
}

$.ajax(request)
    .done(function(response){
        alert(data.name + " Updated Successfully!");
        window.location.href = "/manage";//redirects to index after alert is closed
    })
    .fail(function(xhr, status, error){
        handleAjaxError(xhr, "Cập nhật thuốc thất bại");
    })

})

if(window.location.pathname == "/manage"){//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function(){//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        let request = {//save API request in variable
            "url" : `https://${url}/api/drugs/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){// bring out confirm box
            $.ajax(request)
                .done(function(response){// if confirmed, send API request
                    alert("Drug deleted Successfully!");//show an alert that it's done
                    location.reload();//reload the page
                })
                .fail(function(xhr, status, error){
                    handleAjaxError(xhr, "Xóa thuốc thất bại");
                })
        }

    })
}

if(window.location.pathname == "/purchase"){
//$("#purchase_table").hide();

$("#drug_days").submit(function(event){//on a submit event on the element with id add_drug
    event.preventDefault();//prevent default submit behaviour
    $("#purchase_table").show();
    days = +$("#days").val();
    alert("Drugs for " + days + " days!");//alert this in the browser
})

}
