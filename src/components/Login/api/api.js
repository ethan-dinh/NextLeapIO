export async function loginUser(formData) {
    const url = "https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/login.php";
  
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
    });
  
    return response.json();
  }