function catchErrors(error, displayError){
    let errorMsg;
    if(error.response){
        // The request was made and the server responded with a status code that is not in range 2xx
        errorMsg = error.response.data;
        console.error("Error response",errorMsg)

        //For Cloudinary image upload
        if(error.response.data.error){
            errorMsg = error.response.data.error.message;
        }
    }else if (error.request){
        // The request was made, but no response was recieved
        errorMsg = error.request;
        console.error("Error response",errorMsg)
    }else{
        //Something else happened in making the request that triggered an error
        errorMsg = error.message;
        console.error("Error message",errorMsg);
    }
    displayError(errorMsg);
}

export default catchErrors;