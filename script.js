function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  document.getElementById("result").innerText = "Fetching data...";

  let resultHTML = "";

  fetch(tcpaApi)
    .then(res => res.json())
    .then(tcpaData => {
      if (tcpaData && tcpaData.status) {
        resultHTML += `
📱 Phone: ${tcpaData.phone || phone}
✅ Status: ${tcpaData.status}
⚠️ Blacklist: ${tcpaData.listed}
👨‍⚖️ Litigator: ${tcpaData.type}
📍 State: ${tcpaData.state}
🛑 DNC National: ${tcpaData.ndnc}
🛑 DNC State: ${tcpaData.sdnc}\n
        `;
      } else {
        resultHTML += "⚠️ TCPA data not available.\n\n";
      }
      document.getElementById("result").innerText = resultHTML;
    })
    .catch(() => {
      resultHTML += "⚠️ TCPA API request failed.\n\n";
      document.getElementById("result").innerText = resultHTML;
    });

  fetch(personApi)
    .then(res => res.json())
    .then(personData => {
      if (personData && personData.status === "ok" && personData.count > 0) {
        const person = personData.person[0];
        const address = person.addresses && person.addresses.length > 0 ? person.addresses[0] : {};
        resultHTML += `
👤 Owner: ${person.name}
🎂 DOB: ${person.dob} (Age: ${person.age})
🏡 Address: ${address.home || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}
        `;
      } else {
        resultHTML += "🔍 Owner info not available.";
      }
      document.getElementById("result").innerText = resultHTML;
    })
    .catch(() => {
      resultHTML += "⚠️ Person API request failed.";
      document.getElementById("result").innerText = resultHTML;
    });
}
