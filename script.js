function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  document.getElementById("result").innerHTML = "Fetching data...";

  const tcpaPromise = fetch(tcpaApi).then(res => res.json()).catch(err => null);
  const personPromise = fetch(personApi).then(res => res.json()).catch(err => null);

  Promise.all([tcpaPromise, personPromise]).then(([tcpaData, personData]) => {
    let resultHTML = "";

    // ✅ TCPA API Results
    if (tcpaData && tcpaData.status) {
      resultHTML += `
📱 Phone: ${tcpaData.phone || phone}
✅ Status: ${tcpaData.status}
⚠️ Blacklist: ${tcpaData.listed}
👨‍⚖️ Litigator: ${tcpaData.type}
📍 State: ${tcpaData.state}
🛑 DNC National: ${tcpaData.ndnc}
🛑 DNC State: ${tcpaData.sdnc}
      `;
    } else {
      resultHTML += "⚠️ TCPA data not available.\n";
    }

    // ✅ Person API Results
    if (personData && personData.status === "ok" && personData.count > 0) {
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

    document.getElementById("result").innerText = resultHTML.trim();
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

document.getElementById("phoneNumber").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    checkStatus();
  }
});
