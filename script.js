document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded successfully!");
    
    // Check if a section is in the URL and show it
    const section = window.location.hash.substring(1);
    if (section) {
        showSection(section);
    }
});

// Function to navigate within index.html
function navigateTo(section) {
    window.location.href = `index.html#${section}`;
}

// Function to show the correct section on index.html
function showSection(section) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });

    // Show the requested section
    const activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}
