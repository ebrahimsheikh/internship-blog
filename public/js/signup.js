$(function () {

    let pass_1 = false;
    let pass_2 = false;
    $("#confirm").on("input", function () {
        if($(this).val() === ""){
            $(this).css("background-color", "#f3f4f4");
            $('button[type="submit"]').prop('disabled',true);
            pass_2 = false;
        }else if ($(this).val() !== $("#password").val()) {
            $(this).css("background-color", "#FF7F7F");
            $('button[type="submit"]').prop('disabled',true);
            pass_2 = false;
        } else{
            $(this).css("background-color", "#f3f4f4");
            pass_2 = true;
            if(pass_1){
                $('button[type="submit"]').prop('disabled',false);
            }
        }
    });

    $("#username").on("input", function () {
        $.post("/checkUser",{username:$(this).val()} , (data,status)=>{
            if(status === "success"){
                if(data.exists){
                    $("h3").text("This username is taken")
                    pass_1 = false;
                    $("h3").prop("hidden",pass_1);   
                    $('button[type="submit"]').prop('disabled',true);
                }else{
                    pass_1 = true;
                    if(pass_2){
                        $('button[type="submit"]').prop('disabled',false);
                    }
                }
                $("h3").prop("hidden",pass_1);
            }
            
        });
    });
    
    

}); 
