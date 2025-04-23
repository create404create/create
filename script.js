function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  document.getElementById("result").innerHTML = "Fetching data...";

  Promise.all([
    fetch(tcpaApi).then(res => res.json()),
    fetch(personApi).then(res => res.json())
  ])
  .then(([tcpaData, personData]) => {
    let resultHTML = `
📱 Phone: ${tcpaData.phone || phone}
✅ Status: ${tcpaData.status}
⚠️ Blacklist: ${tcpaData.listed}
👨‍⚖️ Litigator: ${tcpaData.type}
📍 State: ${tcpaData.state}
🛑 DNC National: ${tcpaData.ndnc}
🛑 DNC State: ${tcpaData.sdnc}
    `;

    if (personData.status === "ok" && personData.count > 0) {
      const person = personData.person[0];
      const address = person.addresses && person.addresses.length > 0 ? person.addresses[0] : {};
      resultHTML += `
👤 Owner: ${person.name}
🎂 DOB: ${person.dob} (Age: ${person.age})
🏡 Address: ${address.home || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}
      `;
    } else {
      resultHTML += `\n🔍 Owner info not available.`;
    }

    document.getElementById("result").innerHTML = resultHTML.trim();
  })
  .catch(error => {
    console.error("API Error:", error);
    document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
  });
}

function copyResult() {
  const text = document.getElementById("result").innerText;
  const popup = document.getElementById("copy-popup");
  if (!text) return alert("No result to copy!");
  navigator.clipboard.writeText(text)
    .then(() => {
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 3000);
    })
    .catch(() => alert("Failed to copy result."));
}

document.getElementById("phoneNumber").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    checkStatus();
  }
});
