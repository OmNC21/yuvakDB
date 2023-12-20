//jshint esversion:6

// Express Declarations
const express = require("express");
const app = express();
app.use(express.static("public"));

// Body Parser Declarations
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// EJS Declarations
const ejs = require("ejs");
app.set('view engine', 'ejs');

// Mongoose Declarations
const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/Maha_Dale");
mongoose.connect("mongodb+srv://OmNC501:webprojects@cluster0.w0b9oii.mongodb.net/Maha_Dale");

// Port Declaration
const port = 3000;

// Global Arrays
const localityPuneArray = [];
const maharashtraCityArray = [];

// Yuvak Schema Details
const typeOfMemberArray = ['Karyakarini', 'Yuvak'];
const roleArray = ['Pratod', 'Sahayyak Pratod', 'Margadarshak', 'Gat Pramukh', 'Karyakarini', 'Yuvak'];

const yuvakSchema = {
    yuvakName: String,
    contactNo: Number,
    typeOfMember: {
        type: String,
        enum: typeOfMemberArray,
        required: true
    },
    role: {
        type: String,
        enum: roleArray,
        required: true
    },
    dateOfBirth: Date,
    locality: {
        type: String,
        enum: localityPuneArray
    },
    originCity: {
        type: String,
        enum: maharashtraCityArray
    },
    dalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dal'
    },
    dalName: String
};

const Yuvak = mongoose.model("Yuvak", yuvakSchema);

// Dal Schema Details
const dalArray = ["Bose Dal", "Shastri Dal", "Azad Dal", "Angre Dal", "Tilak Dal", "Sarabhai Dal", "Bhabha Dal", "Visvesvaraya Dal"];
const dalTypeArray = ["Krida Dal", "Vijnana Dal"];

const dalSchema = {
    dalName: {
        type: String,
        enum: dalArray
    },
    dalType: {
        type: String,
        enum: dalTypeArray
    },
    dalLocation: {
        type: String,
        enum: localityPuneArray
    }
};

const Dal = mongoose.model("Dal", dalSchema);

// Create and save Dal instances
const dals = [
    { dalName: "Bose Dal", dalType: "Krida Dal", dalLocation: "Sadashiv Peth" },
    { dalName: "Shastri Dal", dalType: "Krida Dal", dalLocation: "Gokhale Nagar" },
    { dalName: "Azad Dal", dalType: "Krida Dal", dalLocation: "Kothrud" },
    { dalName: "Angre Dal", dalType: "Krida Dal", dalLocation: "Warje" },
    { dalName: "Tilak Dal", dalType: "Krida Dal", dalLocation: "Sahkar Nagar" },
    { dalName: "Sarabhai Dal", dalType: "Vijnana Dal", dalLocation: "Kothrud" },
    { dalName: "Bhabha Dal", dalType: "Vijnana Dal", dalLocation: "Sadashiv Peth" },
    { dalName: "Visvesvaraya Dal", dalType: "Vijnana Dal", dalLocation: "Sahkar Nagar" }
];

// Dal.insertMany(dals)
//   .then(() => {
//     console.log('Dals inserted successfully!');
//   })
//   .catch((err) => {
//     console.error('Error inserting Dals:', err);
//   });


// Sample GET route for the home page
app.get('/', function (req, res) {
    // Render the home.ejs file
    res.render('home');
});

// Sample GET route for the "/addYuvak" page
app.get('/addYuvak', function (req, res) {
    // Render the addYuvak.ejs file and pass necessary data
    res.render('addYuvak', {
        typeOfMemberArray: typeOfMemberArray,
        roleArray: roleArray,
        dalArray: dalArray
    });
});

// Sample POST route for handling form submission on "/addYuvak"
app.post('/addYuvak', async function (req, res) {
    try {
        // Extract form data and process accordingly
        const yuvakData = {
            yuvakName: req.body.yuvakName,
            contactNo: req.body.contactNo,
            typeOfMember: req.body.typeOfMember,
            role: req.body.role,
            dateOfBirth: req.body.dateOfBirth,
            locality: req.body.locality,
            originCity: req.body.originCity,
            dalName: req.body.dalName
            // Add other fields as needed
        };

        // Find the corresponding dal document based on the dalName
        const dal = await Dal.findOne({ dalName: yuvakData.dalName }).exec();

        if (!dal) {
            console.error('Dal not found');
            // Handle the case where the Dal is not found
            res.redirect('/addYuvak'); // Redirect to the addYuvak page with an error message
            return;
        }

        // Set the dalID field in yuvakData
        yuvakData.dalID = dal._id;

        // Create a new Yuvak instance with the processed data
        const newYuvak = new Yuvak(yuvakData);

        // Save the Yuvak instance to the database
        await newYuvak.save();

        console.log('Yuvak saved:', newYuvak);
        // Redirect to a success page or perform any other actions
        res.redirect('/');
    } catch (error) {
        console.error('Error saving Yuvak:', error);
        // Handle the error appropriately
        res.redirect('/addYuvak'); // Redirect to the addYuvak page with an error message
    }
});

app.get('/dals', async (req, res) => {
    try {
        // Fetch all dals from the database
        const dals = await Dal.find({});

        // Render the 'dals.ejs' file and pass the dals data to it
        res.render('dals', { dals });
    } catch (error) {
        console.error('Error fetching dals:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/yuvaks', async (req, res) => {
    try {
        // Fetch all yuvaks from the database
        const yuvaks = await Yuvak.find({});

        // Render the 'yuvaks.ejs' file and pass the yuvaks data to it
        res.render('yuvaks', { yuvaks });
    } catch (error) {
        console.error('Error fetching yuvaks:', error);
        res.status(500).send('Internal Server Error');
    }
});


// ... (other routes and configurations)

// Start the server
app.listen(port, function () {
    console.log('Server started on port ' + port);
});
