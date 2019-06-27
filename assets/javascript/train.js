
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAjU0v2B1e1CkU5c68LWwnkBqY1INIPNXs",
    authDomain: "train-schedule-bootcamp-001.firebaseapp.com",
    databaseURL: "https://train-schedule-bootcamp-001.firebaseio.com",
    projectId: "train-schedule-bootcamp-001",
    storageBucket: "train-schedule-bootcamp-001.appspot.com",
    messagingSenderId: "991710653529",
    appId: "1:991710653529:web:f95c1df8bdb60b6b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var trainData = firebase.database();


$("#addTrain").on("click", function(event) {
  event.preventDefault();

  // Grabbing user input
  var trainName = $("#trainNameInput")
    .val()
    .trim();
  var destination = $("#trainDestinationInput")
    .val()
    .trim();
  var firstTrain = $("#trainFirstTimeInput")
    .val()
    .trim();
  var frequency = $("#trainFrequencyInput")
    .val()
    .trim();

  // Holding the train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Push train info to database
  trainData.ref().push(newTrain);

  alert("New train added!");

  // Clears all of the text-boxes
  $("#trainNameInput").val("");
  $("#trainDestinationInput").val("");
  $("#trainFirstTimeInput").val("");
  $("#trainFrequencyInput").val("");
});

// adding data into firebase
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // Storing info as a var
  var fbTrain = childSnapshot.val().name;
  var fbDestination = childSnapshot.val().destination;
  var fbFrequency = childSnapshot.val().frequency;
  var fbFirstTrain = childSnapshot.val().firstTrain;
  var timeArr = fbFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // calculate train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % fbFrequency;
    tMinutes = fbFrequency - tRemainder;
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // put train data into the html
  $("#train-table").append(
    $("<tr>").append(
      $("<td>").text(fbTrain),
      $("<td>").text(fbDestination),
      $("<td>").text(fbFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});