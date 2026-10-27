// ==========================================
// Web Audio API សម្រាប់បង្កើតសំឡេង (Sound Effects)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === "correct") {
    // សំឡេងឆ្លើយត្រូវ (Ding-Ding!)
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === "wrong") {
    // សំឡេងឆ្លើយខុស (Buzzer)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === "timeout") {
    // សំឡេងអស់ពេល
    osc.type = "square";
    osc.frequency.setValueAtTime(200, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === "win") {
    // សំឡេងឈ្នះ/ទទួលបានលទ្ធផលល្អ (Fanfare)
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteGain.connect(audioCtx.destination);

      noteOsc.type = "triangle";
      noteOsc.frequency.setValueAtTime(freq, now + index * 0.12);
      noteGain.gain.setValueAtTime(0.3, now + index * 0.12);
      noteGain.gain.exponentialRampToValueAtTime(
        0.01,
        now + index * 0.12 + 0.3,
      );

      noteOsc.start(now + index * 0.12);
      noteOsc.stop(now + index * 0.12 + 0.3);
    });
  }
}

// ==========================================
// ទិន្នន័យសំណួរ (Quiz Data)
// ==========================================
const quizData = {
  networking: [
    {
      question: "១. តើ IP Address ប្រភេទ IPv4 មានប្រវែងប៉ុន្មាន Bit?",
      options: ["16 Bits", "32 Bits", "64 Bits", "128 Bits"],
      correct: 1,
    },
    {
      question: "២. តើ Port 80 ប្រើប្រាស់សម្រាប់ Protocol មួយណា?",
      options: ["FTP", "SSH", "HTTP", "HTTPS"],
      correct: 2,
    },
    {
      question: "៣. តើឧបករណ៍មួយណាប្រើសម្រាប់តភ្ជាប់បណ្តាញ Network ខុសៗគ្នា?",
      options: ["Switch", "Hub", "Router", "Repeater"],
      correct: 2,
    },
    {
      question: "៤. តើ Subnet Mask ដើមរបស់ Class C គឺអ្វី?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      correct: 2,
    },
    {
      question: "៥. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើអ៊ីមែល?",
      options: ["SMTP", "IMAP", "POP3", "ទាំងអស់ខាងលើ"],
      correct: 3,
    },
    {
      question: "៦. តើ Protocol មួយណាដែលផ្តល់សុវត្ថិភាពក្នុងការផ្ញើទិន្នន័យ?",
      options: ["HTTP", "HTTPS", "FTP", "Telnet"],
      correct: 1,
    },
    {
      question: "៧. តើ Protocol មួយណាដែលប្រើសម្រាប់ចូលទៅកាន់ Server ពីចម្ងាយ?",
      options: ["FTP", "SSH", "SMTP", "DNS"],
      correct: 1,
    },
    {
      question:
        "៨. តើ Protocol មួយណាដែលប្រើសម្រាប់បម្លែងឈ្មោះ Domain ទៅ IP Address?",
      options: ["HTTP", "DNS", "DHCP", "SNMP"],
      correct: 1,
    },
    {
      question:
        "៩. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើឯកសារពី Client ទៅ Server?",
      options: ["FTP", "SMTP", "HTTP", "SNMP"],
      correct: 0,
    },
    {
      question: "១០. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យជាមធ្យម?",
      options: ["TCP", "UDP", "HTTP", "HTTPS"],
      correct: 0,
    },
    {
      question:
        "១១. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យដោយមិនមានការត្រួតពិនិត្យ?",
      options: ["TCP", "UDP", "FTP", "SMTP"],
      correct: 1,
    },
    {
      question: "១២. តើ​​ IPv6 មានប្រវែងប៉ុន្មាន Bit?",
      options: ["32 Bits", "64 Bits", "128 Bits", "256 Bits"],
      correct: 2,
    },
    {
      question: "១៣. តើ​​ MAC Address មានប្រវែងប៉ុន្មាន Byte?",
      options: ["4 Bytes", "6 Bytes", "8 Bytes", "10 Bytes"],
      correct: 1,
    },
    {
      question: "១៤. តើ​ IPv6 គីជា្វអ្វី?",
      options: [
        "Internet Protocol Version 4",
        "Internet Protocol Version 6",
        "Internet Proxy Protocol",
        "Internet Packet Protocol",
      ],
      correct: 1,
    },
    {
      question:
        "១៥. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើអ៊ីមែលពី Client ទៅ Server?",
      options: ["SMTP", "IMAP", "POP3", "HTTP"],
      correct: 0,
    },
    {
      question: "១៦. តើ​ OSI Model មានប៉ុន្មានស្រទាប់?",
      options: ["4 ស្រទាប់", "5 ស្រទាប់", "6 ស្រទាប់", "7 ស្រទាប់"],
      correct: 3,
    },
    {
      question:
        "១៧. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យក្នុងបណ្តាញ Local Area Network?",
      options: ["TCP", "UDP", "Ethernet", "IP"],
      correct: 2,
    },
    {
      question:
        "១៨. តើ​ OSI Model ស្រទាប់ណាដែលទទួលខុសត្រូវចំពោះការផ្ញើទិន្នន័យពី Application ទៅ Network?",
      options: [
        "ស្រទាប់ Application",
        "ស្រទាប់ Transport",
        "ស្រទាប់ Network",
        "ស្រទាប់ Data Link",
      ],
      correct: 1,
    },
    {
      question:
        "១៩. តើ​ OSI Model ស្រទាប់ណាដែលទទួលខុសត្រូវចំពោះការផ្ញើទិន្នន័យពី Network ទៅ Physical Layer?",
      options: [
        "ស្រទាប់ Network",
        "ស្រទាប់ Data Link",
        "ស្រទាប់ Physical",
        "ស្រទាប់ Transport",
      ],
      correct: 1,
    },
    {
      question:
        "២០. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យក្នុងបណ្តាញ Wide Area Network?",
      options: ["TCP", "UDP", "Ethernet", "IP"],
      correct: 3,
    },
    {
      question:
        "២១. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យក្នុងបណ្តាញ Local Area Network?",
      options: ["TCP", "UDP", "Ethernet", "IP"],
      correct: 2,
    },
    {
      question:
        "២២. តើ Protocol មួយណាដែលប្រើសម្រាប់ផ្ញើទិន្នន័យក្នុងបណ្តាញ Wireless?",
      options: ["TCP", "UDP", "Wi-Fi", "IP"],
      correct: 2,
    },
  ],
  webdev: [
    {
      question: "១. តើ HTML មកពីពាក្យពេញថាអ្វី?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlink Text Mode Link",
        "Home Tool Markup Language",
      ],
      correct: 0,
    },
    {
      question: "២. តើ Property មួយណាក្នុង CSS ប្រើសម្រាប់ដូរពណ៌អក្សរ?",
      options: ["text-color", "color", "font-color", "background-color"],
      correct: 1,
    },
    {
      question:
        "៣. តើ Keyword មួយណាដែលប្រកាស Variable មិនអាចផ្លាស់ប្តូរតម្លៃបាន?",
      options: ["let", "var", "const", "static"],
      correct: 2,
    },
  ],
  hardware: [
    {
      question: "១. សមាសភាគកុំព្យូទ័រមួយណាដែលដើរតួជា «ខួរក្បាល»?",
      options: ["RAM", "Hard Disk", "CPU", "Power Supply"],
      correct: 2,
    },
    {
      question: "២. តើ RAM ជាប្រភេទ Memory បែបណា?",
      options: [
        "Volatile (បាត់ទិន្នន័យពេលបិទភ្លើង)",
        "Non-Volatile",
        "Permanent Storage",
        "Optical Storage",
      ],
      correct: 0,
    },
    {
      question: "៣. តើ Hard Disk ជាប្រភេទ Memory បែបណា?",
      options: [
        "Volatile (បាត់ទិន្នន័យពេលបិទភ្លើង)",
        "Non-Volatile",
        "Permanent Storage",
        "Optical Storage",
      ],
      correct: 1,
    },
    {
      question: "៤. តើ CPU មានតួនាទីអ្វីខ្លះក្នុងកុំព្យូទ័រ?",
      options: [
        "គណនាទិន្នន័យ និងបញ្ជាដំណើរការទាំងអស់",
        "ផ្ទុកទិន្នន័យជាអចិន្ត្រៃយ៍",
        "ផ្គត់ផ្គង់ថាមពលអគ្គិសនី",
        "បង្ហាញរូបភាពលើអេក្រង់",
      ],
      correct: 0,
    },
    {
      question: "៥. តើ RAM មានតួនាទីអ្វីខ្លះក្នុងកុំព្យូទ័រ?",
      options: [
        "ផ្ទុកទិន្នន័យជាអចិន្ត្រៃយ៍",
        "ផ្គត់ផ្គង់ថាមពលអគ្គិសនី",
        "ផ្ទុកទិន្នន័យបណ្តោះអាសន្នសម្រាប់កម្មវិធីដែលកំពុងដំណើរការ",
        "បង្ហាញរូបភាពលើអេក្រង់",
      ],
      correct: 0,
    },
    {
      question: "៦. តើប្រភេទ Storage មួយណាដែលមានល្បឿនលឿនជាងគេ?",
      options: [
        "HDD (Hard Disk Drive)",
        "SSD NVMe M.2",
        "SATA SSD",
        "Flash Drive",
      ],
      correct: 1,
    },
    {
      question: "៧. តើ Motherboard មានតួនាទីអ្វីខ្លះក្នុងកុំព្យូទ័រ?",
      options: [
        "ផ្ទុកទិន្នន័យជាអចិន្ត្រៃយ៍",
        "ផ្គត់ផ្គង់ថាមពលអគ្គិសនី",
        "ផ្ជាប់សមាសភាគ hardware ទាំងអស់ឱ្យធ្វើការជាមួយគ្នា",
        "បង្ហាញរូបភាពលើអេក្រង់",
      ],
      correct: 2,
    },
    {
      question: "៨. តើ GPU (Graphics Processing Unit) មានតួនាទីចម្បងអ្វី?",
      options: [
        "គណនាទិន្នន័យទូទៅ",
        "ដំណើរការ និងបង្ហាញរូបភាព/វីដេអូ (Graphics)",
        "រក្សាទុកឯកសារសំខាន់ៗ",
        "គ្រប់គ្រងការចុច Keyboard និង Mouse",
      ],
      correct: 1,
    },
    {
      question:
        "៩. តើឧបករណ៍មួយណាដែលផ្គត់ផ្គង់ថាមពលអគ្គិសនីទៅកាន់គ្រឿងបំណែកកុំព្យូទ័រ?",
      options: ["CPU", "Motherboard", "PSU (Power Supply Unit)", "Cooling Fan"],
      correct: 2,
    },
    {
      question: "១០. តើ ROM (Read-Only Memory) ត្រូវបានប្រើប្រាស់សម្រាប់អ្វី?",
      options: [
        "ផ្ទុកទិន្នន័យហ្គេម និងកម្មវិធី",
        "រក្សាទុកកូដ BIOS/UEFI សម្រាប់ Boot ម៉ាស៊ីន",
        "បង្កើនល្បឿនអ៊ីនធឺណិត",
        "បណ្ដោះអាសន្នពេលបើកកម្មវិធីច្រើន",
      ],
      correct: 1,
    },
    {
      question: "១១. តើឧបករណ៍ណាដែលចាត់ទុកថាជា Input Device?",
      options: ["Monitor", "Printer", "Keyboard", "Speaker"],
      correct: 2,
    },
    {
      question: "១២. តើឧបករណ៍ណាដែលចាត់ទុកថាជា Output Device?",
      options: ["Mouse", "Microphone", "Scanner", "Monitor"],
      correct: 3,
    },
    {
      question:
        "១៣. តើ (Port) ប្រភេទណាមួយដែលប្រើប្រាស់សម្រាប់បញ្ជូនទាំងសញ្ញាវីដេអូ និងអូឌីយ៉ូឌីជីថលក្នុងពេលតែមួយ?",
      options: ["VGA", "HDMI", "PS/2", "COM Port"],
      correct: 1,
    },
    {
      question: "១៤. តើមុខងារចម្បងរបស់ Heat Sink និង Cooling Fan គឺដើម្បីអ្វី?",
      options: [
        "បង្កើនល្បឿនអុិនធឺណិត",
        "បឺតយកកម្ដៅចេញពី CPU និងកាត់បន្ថយកម្ដៅក្នុងម៉ាស៊ីន",
        "ផ្គត់ផ្គង់ចរន្តអគ្គិសនីបន្ថែម",
        "ការពារកុំព្យូទ័រពីមេរោគ",
      ],
      correct: 1,
    },
    {
      question:
        "១៥. តើ SSD មុខ M.2 NVMe ភ្ជាប់តាមរយៈរន្ធប្រភេទអ្វីនៅលើ Motherboard?",
      options: ["PCIe / M.2 Slot", "SATA Cable", "USB Port", "PCI Slot ចាស់"],
      correct: 0,
    },
    {
      question:
        "១៦. តើកូដ POST (Power-On Self-Test) មានន័យដូចម្តេចពេលកុំព្យូទ័រចាប់ផ្តើមដំបូង?",
      options: [
        "ការឆែកពិនិត្យ Hardware ទាំងអស់ថាតើដំណើរការធម្មតាដែរឬទេ",
        "ការទាញយក Windows មកកាន់ RAM",
        "ការតភ្ជាប់ប្រព័ន្ធអ៊ីនធឺណិត",
        "ការសម្អាតមេរោគក្នុង Hard Disk",
      ],
      correct: 0,
    },
    {
      question:
        "១៧. តើអង្គចងចាំキャッシュ (Cache Memory) ដែលស្ថិតនៅជិត CPU បំផុតគឺកម្រិតណា?",
      options: ["L3 Cache", "L2 Cache", "L1 Cache", "RAM Cache"],
      correct: 2,
    },
    {
      question:
        "១៨. តើកាតពង្រីក (Expansion Cards) ដូចជា GPU ត្រូវเสียbចូលទៅក្នុងរន្ធអ្វីនៅលើ Motherboard?",
      options: ["RAM Slot", "PCI Express (PCIe) Slot", "IDE Slot", "SATA Port"],
      correct: 1,
    },
    {
      question: "១៩. តើ RAID 0 មានលក្ខណៈពិសេសអ្វី?",
      options: [
        "បម្រុងទុកទិន្នន័យ (Backup)",
        "បែងចែកទិន្នន័យឆ្លាស់គ្នាលើ Hard Disk ច្រើនដើម្បីបង្កើនល្បឿន",
        "ការពារកុំព្យូទ័រពីការដាច់ភ្លើង",
        "លុបទិន្នន័យស្វ័យប្រវត្តិ",
      ],
      correct: 1,
    },
    {
      question: "២០. តើ BIOS/UEFI ត្រូវបានរក្សាទុកនៅលើអ្វីពេលកុំព្យូទ័របិទ?",
      options: ["RAM", "CMOS / Flash ROM Chip", "Hard Disk", "CPU Cache"],
      correct: 1,
    },
    {
      question: "២១. តើថាមពលរបស់ PSU (Power Supply Unit) វាស់វែងជាខ្នាតអ្វី?",
      options: ["Volt (V)", "Ampere (A)", "Watt (W)", "Hertz (Hz)"],
      correct: 2,
    },
    {
      question:
        "២២. តើខ្សែកាបប្រភេទណាដែលនិយមប្រើប្រាស់សម្រាប់ភ្ជាប់បណ្ដាញអ៊ីនធឺណិតមានខ្សែ (Local Network)?",
      options: [
        "HDMI Cable",
        "VGA Cable",
        "Ethernet Cable (UTP/Cat6)",
        "SATA Cable",
      ],
      correct: 2,
    },
    {
      question:
        "២៣. តើប៊ូតុង CMOS Battery (ថាមពល) នៅលើ Motherboard មាននាទីអ្វី?",
      options: [
        "ផ្គត់ផ្គង់ថាមពលឱ្យ CPU ពេលបើកហ្គេមធំៗ",
        "រក្សាទុកម៉ោង ថ្ងៃខែ និងការកំណត់ System BIOS ពេលបិទម៉ាស៊ីន",
        "សាកថ្មឱ្យ Laptop",
        "ទប់ស្កាត់មិនឱ្យឆេះ motherboard",
      ],
      correct: 1,
    },
    {
      question:
        "២៤. តើអង្គចងចាំប្រភេទណាដែលមានល្បឿនលឿនជាងគេក្នុងចំណោមអង្គចងចាំទាំងអស់?",
      options: ["Hard Disk", "SSD", "RAM", "CPU Registers"],
      correct: 3,
    },
    {
      question:
        "២៥. តើកុំព្យូទ័រប្រភេទ All-in-One មានលក្ខណៈខុសពី Desktop ធម្មតាอย่างไร?",
      options: [
        "គ្មាន Keyboard និង Mouse",
        "គ្មាន Case ដាច់ដោយឡែក គឺ Hardware ទាំងអស់ត្រូវបានបង្កប់នៅខាងក្រោយ Monitor",
        "ប្រើប្រាស់ថាមពលថ្មទូរស័ព្ទ",
        "មិនអាចភ្ជាប់អ៊ីនធឺណិតបាន",
      ],
      correct: 1,
    },
    {
      question:
        "២៦. តើ Refresh Rate របស់ Monitor មានអង្គវាស់ជាអ្វី និងបញ្ជាក់ពីអ្វី?",
      options: [
        "Hertz (Hz) - ចំនួនដងដែលរូបភាពត្រូវបានគូរឡើងវិញក្នុងមួយវិនាទី",
        "Pixel - ទំហំភាពច្បាស់",
        "Inch - ទំហំអេក្រង់",
        "Volt - កម្រិតភ្លើងប្រើប្រាស់",
      ],
      correct: 0,
    },
    {
      question:
        "២៧. តើសុភាសិត ឬកូដកំហុសពេល Boot ម៉ាស៊ីនចេញជាសំឡេងទីប (Beep Codes) បង្ហាញពីអ្វី?",
      options: [
        "កុំព្យូទ័រតភ្ជាប់អ៊ីនធឺណិតបានជោគជ័យ",
        "សញ្ញាព្រមានពីបញ្ហា Hardware ដូចជា RAM ឬ CPU ຜິດប្រក្រតី",
        "សញ្ញាបញ្ជាក់ថាថ្មពេញ",
        "ការទាញយក Update ថ្មី",
      ],
      correct: 1,
    },
    {
      question:
        "២៨. តើបច្ចេកវិទ្យា ECC RAM ត្រូវបានប្រើប្រាស់នៅលើម៉ាស៊ីនប្រភេទណា?",
      options: [
        "Gaming PC ធម្មតា",
        "Servers និង Workstations សំខាន់ៗ",
        "Smartphones",
        "Office Laptops",
      ],
      correct: 1,
    },
    {
      question: "២៩. តើ Peripherals មានន័យថាអ្វីក្នុងប្រព័ន្ធកុំព្យូទ័រ?",
      options: [
        "សមាសភាគស្នូលក្នុង Case (CPU, RAM)",
        "ឧបករណ៍បរិវា ឬឧបករណ៍ខាងក្រៅដែលភ្ជាប់បន្ថែម (Keyboard, Mouse, Printer)",
        "ប្រព័ន្ធប្រតិបត្តិការ Windows",
        "ប្រព័ន្ធខ្សែភ្លើងក្នុងផ្ទះ",
      ],
      correct: 1,
    },
    {
      question:
        "៣០. តើសារៈសំខាន់នៃ Thermal Paste រវាង CPU និង Heat Sink គឺដើម្បីអ្វី?",
      options: [
        "ជួយឱ្យ CPU ជាប់នឹង Heat Sink មាំល្អ",
        "បំពេញចន្លោះប្រហោងខ្យល់តូចៗ ដើម្បីជួយបញ្ជូនកម្ដៅពី CPU ទៅ Heat Sink បានល្អប្រសើរ",
        "ការពារមិនឱ្យឆក់ចរន្តអគ្គិសនី",
        "បន្ថែមល្បឿនអុិនធឺណិតឱ្យ CPU",
      ],
      correct: 1,
    },
  ],
};

let currentCategory = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let isFiftyFiftyUsed = false;

const categoryScreen = document.getElementById("category-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionCount = document.getElementById("question-count");
const timerDisplay = document.getElementById("timer");
const fiftyFiftyBtn = document.getElementById("fifty-fifty-btn");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback-text");
const highScoreElement = document.getElementById("high-score");

let highScore = localStorage.getItem("quizHighScore") || 0;
if (highScoreElement) highScoreElement.innerText = highScore;

function startQuiz(categoryKey) {
  currentCategory = quizData[categoryKey] || quizData.networking;
  currentQuestionIndex = 0;
  score = 0;
  isFiftyFiftyUsed = false;

  categoryScreen.classList.add("hide");
  resultScreen.classList.add("hide");
  quizScreen.classList.remove("hide");

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  startTimer();

  const currentQuiz = currentCategory[currentQuestionIndex];
  questionText.innerText = currentQuiz.question;
  questionCount.innerText = `សំណួរ ${currentQuestionIndex + 1} នៃ ${currentCategory.length}`;

  optionsContainer.innerHTML = "";
  currentQuiz.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = option;
    btn.onclick = () => selectAnswer(index, btn);
    optionsContainer.appendChild(btn);
  });

  if (fiftyFiftyBtn) {
    fiftyFiftyBtn.disabled = isFiftyFiftyUsed;
    fiftyFiftyBtn.style.opacity = isFiftyFiftyUsed ? "0.5" : "1";
  }
}

function startTimer() {
  timerDisplay.innerText = `⏰ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `⏰ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      playSound("timeout"); // 🔊 លោតសំឡេងអស់ពេល
      nextQuestion();
    }
  }, 1000);
}

function selectAnswer(selectedIndex, selectedBtn) {
  clearInterval(timer);
  const currentQuiz = currentCategory[currentQuestionIndex];
  const allBtns = optionsContainer.querySelectorAll(".option-btn");

  allBtns.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === currentQuiz.correct) {
    selectedBtn.style.background = "#28a745";
    selectedBtn.style.color = "#fff";
    score++;
    playSound("correct"); // 🔊 លោតសំឡេងឆ្លើយត្រូវ
  } else {
    selectedBtn.style.background = "#dc3545";
    selectedBtn.style.color = "#fff";
    if (allBtns[currentQuiz.correct]) {
      allBtns[currentQuiz.correct].style.background = "#28a745";
      allBtns[currentQuiz.correct].style.color = "#fff";
    }
    playSound("wrong"); // 🔊 លោតសំឡេងឆ្លើយខុស
  }

  setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentCategory.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function useFiftyFifty() {
  if (isFiftyFiftyUsed) return;
  isFiftyFiftyUsed = true;
  fiftyFiftyBtn.disabled = true;
  fiftyFiftyBtn.style.opacity = "0.5";

  const currentQuiz = currentCategory[currentQuestionIndex];
  const allBtns = optionsContainer.querySelectorAll(".option-btn");
  let wrongIndexes = [];

  currentQuiz.options.forEach((_, idx) => {
    if (idx !== currentQuiz.correct) wrongIndexes.push(idx);
  });

  wrongIndexes
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .forEach((idx) => {
      if (allBtns[idx]) allBtns[idx].style.visibility = "hidden";
    });
}

function showResult() {
  clearInterval(timer);
  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");

  scoreText.innerText = `អ្នកទទួលបាន ${score} / ${currentCategory.length} ពិន្ទុ!`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("quizHighScore", highScore);
    if (highScoreElement) highScoreElement.innerText = highScore;
  }

  if (score === currentCategory.length) {
    feedbackText.innerText = "🎉 អស្ចារ្យណាស់! អ្នកឆ្លើយត្រូវទាំងអស់!";
    playSound("win"); // 🔊 លោតសំឡេងឈ្នះ
  } else if (score >= currentCategory.length / 2) {
    feedbackText.innerText = "👍 ល្អណាស់! អ្នកធ្វើបានគ្រាន់បើ។";
    playSound("win");
  } else {
    feedbackText.innerText = "💪 ខិតខំប្រឹងប្រែងបន្ថែមទៀតណា!";
    playSound("wrong");
  }
}

function restartQuiz() {
  clearInterval(timer);
  resultScreen.classList.add("hide");
  quizScreen.classList.add("hide");
  categoryScreen.classList.remove("hide");
}
