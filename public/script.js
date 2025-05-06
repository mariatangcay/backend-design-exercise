const API_URL = 'http://localhost:3000/api/users'; 

// Function to register a new user
async function register() {

    //retrieve user input values
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    try {
        //send POST request to the register endpoint
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, //set content type to JSON
            body: JSON.stringify({ username, password, email }) 
        });
        //parse the JSON response from the server
        const data = await response.json();
        alert(data.message); 
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.'); 
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log('Response:', response); // Log the response object

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            console.log('Login successful!'); // Log to the console
            alert('Login successful!'); 
            document.getElementById('register-section').style.display = 'none';
            getUserProfile(); 
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData); // Log error details
            alert(`Login failed: ${errorData.message}`); 
        }
    } catch (error) {
        console.error('Error during login:', error); // Log any errors
        alert('An error occurred. Please try again.'); 
    }
}


// Function to retrieve and display the user profile
async function getUserProfile() {
    const token = localStorage.getItem('token');

    //send a GET req to the profile endpoint with the token in the authentication
    const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const user = await response.json();
        document.getElementById('profile-data').innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
        `;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('profile-section').style.display = 'block';
    } else {
        console.error('Failed to fetch profile:', await response.json());
        alert('Failed to fetch profile. Please log in again.'); 
    }
}

// Function to log out the user
function logout() {
    localStorage.removeItem('token');
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('register-section').style.display = 'block';
}
