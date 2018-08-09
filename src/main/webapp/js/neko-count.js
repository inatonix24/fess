var NekocountTableName = "Nekocount"
var isNekocountready = false;
var addedNekocount = 0;
var isNekocountupdating = false;

function initAWSconfig() {
    AWS.config.update({
        region: "us-east-1",
    });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:7019adee-e4b3-44a4-852d-5de814122221",
        RoleArn: "arn:aws:iam::931594971096:role/Cognito_DynamoPoolUnauth"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    return docClient;
}

function updateCount(docClient, params) {
    docClient.get(params, function(err, data) {
        if (err) {
            console.error(err)
        } else {
            var nowCount = parseInt($("#nekocount").text())
            
            var newCount = data.Item.nekocount
            if(isNaN(nowCount) || nowCount < newCount) {
                $("#nekocount").html(newCount)
                if(!isNekocountready) {
                    $("#nekocount").css('visibility', 'visible')
                    isNekocountready = true;
                    setTimeout(function (){
                        //firefoxだとなぜか少し待ってから値を更新しないとcssが変になる場合がある
                        var temp = $("#nekocount").text()
                        $("#nekocount").html(temp)
                        // $("#nekocount").css('-webkit-animation', 'neon 1.2s ease-in-out infinite alternate');
                        // $("#nekocount").css('animation', 'neon 1.2s ease-in-out infinite alternate');
                    },1100)//検証して最短の時間
                }
            }
        }
    });
}

function getNekocount() {
    var docClient = initAWSconfig();
    AWS.config.credentials.get(function(error) {
        if (!error) {
            var params = {
                TableName: NekocountTableName,
                Key:{
                    "id": 0
                }
            };
            updateCount(docClient, params)
        }
    })
}

function updateNekocount() {
    if(!isNekocountupdating && addedNekocount !== 0) {
        isNekocountupdating = true;
        var docClient = initAWSconfig();
        AWS.config.credentials.get(function(error) {
            if (!error) {
                var tempCount = addedNekocount;
                var params = {
                    TableName: NekocountTableName,
                    Key:{
                        "id": 0
                    },
                    UpdateExpression: "set nekocount = nekocount + :val",
                    ExpressionAttributeValues:{
                        ":val": tempCount
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                docClient.update(params, function(err, data) {
                    if (err) {
                        console.error(err)
                    } else {
                        addedNekocount = addedNekocount - tempCount;
                    }
                    setTimeout(function() {
                        isNekocountupdating = false;
                    }, 2000);
                });
            }
        })
    }
}


function addNekocount() {
    //isNekocountready falseの場合もカウントをキャッシュした方がいいか。
    //現状だとカウントが表示されるまでにクリックしてもカウントされない。
    if(isNekocountready) {
        addedNekocount += 1;
        $("#nekocount").html(parseInt($("#nekocount").text()) + 1);
    }
}
