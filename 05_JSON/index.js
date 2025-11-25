//- obj type
let userObj =
{
    username: "Idan",
    grade: 100,
    password: "12345",
    isConnected: true,
    adress: {
        country: "Israel",
        city: "Nahariya",
        street: "Keren Hayesod 38"
    },
    allGrades: [{ csharp: 90 }, { cpp: 80 }, 90, 100, 95]
}

let newGrade = userObj.grade - 5;

userObj.grade -= 10;

userObj.id = 1000;

// userObj2 will point to same place as userObj
let userObj2 = userObj;
// will change for userObj too
userObj.grade += 10;
userObj2.grade = 0;
let grade1 = userObj.grade;

userObj.adress.street = "";
userObj["adress"]["city"] = "tel aviv";
userObj["adress"].city = "Tel Aviv";

//arr[0] points to same userObj
let arr = [userObj, {
    username: "Idan",
    grade: 100,
    password: "12345",
    isConnected: true,
    adress: {
        country: "Israel",
        city: "Nahariya",
        street: "Keren Hayesod 38"
    },
    allGrades: [{ csharp: 90 }, { cpp: 80 }, 90, 100, 95]
}
]

// will change userObj
arr[0].allGrades[1] = { CPP: 95 };
arr[1].avg = 95;
//clone
let user2 = arr[1];
user2.password = "123";

