# -------------------------------
# PowerShell script to test MERN blog API
# -------------------------------

# Step 1: Register a new user
$registerBody = @{
    username = "john"
    email    = "john@example.com"
    password = "123456"
} | ConvertTo-Json

Write-Host "Registering user..."
try {
    $registerResponse = Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Register Response:" ($registerResponse | ConvertTo-Json)
} catch {
    Write-Warning "User may already exist. Proceeding to login..."
}

# Step 2: Login to get JWT token
$loginBody = @{
    email    = "john@example.com"
    password = "123456"
} | ConvertTo-Json

Write-Host "Logging in..."
try {
    $loginResponse = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful. Token received."
} catch {
    Write-Error "Login failed. Check credentials."
    exit
}

# Step 3: Create a new post
$postBody = @{
    title   = "My First Post"
    content = "Hello World!"
} | ConvertTo-Json

Write-Host "Creating a post..."
try {
    $postResponse = Invoke-RestMethod -Uri http://localhost:5000/api/posts -Method POST -Body $postBody -ContentType "application/json" -Headers @{Authorization = "Bearer $token"}
    Write-Host "Post created successfully:" ($postResponse | ConvertTo-Json)
} catch {
    Write-Error "Failed to create post."
}
