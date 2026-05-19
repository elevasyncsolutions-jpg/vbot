<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Apex Engine V18 | Control Panel</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #050505; color: #f3f4f6; }
    .glass { background: #111; border: 1px solid #262626; border-radius: 8px; }
  </style>
</head>
<body class="p-4 md:p-8">

  <div id="authOverlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
    <div class="glass p-8 w-full max-w-sm text-center">
      <h1 class="text-xl font-bold text-yellow-500 mb-4">APEX ENGINE V18</h1>
      <input id="pwd" type="password" placeholder="Password" class="w-full bg-black border border-gray-800 p-2 mb-4 text-center">
      <button onclick="login()" class="w-full bg-yellow-600/20 border border-yellow-600 p-2 text-yellow-500">UNLOCK</button>
    </div>
  </div>

  <div id="mainApp" class="hidden max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-yellow-500">APEX ENGINE V18</h1>
      <div class="flex gap-2">
        <button onclick="api('start')" class="px-4 py-2 bg-green-900/20 text-green-500 border border-green-800">ARM ENGINE</button>
        <button onclick="api('stop')" class="px-4 py-2 bg-red-900/20 text-red-500 border border-red-800">HALT</button>
      </div>
    </div>
    
    <div class="glass p-4 h-[400px] overflow-y-auto font-mono text-sm" id="logStream">
      <div class="text-gray-500">System standby...</div>
    </div>
  </div>

  <script>
    async function login() {
      const res = await fetch('/api/login', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({password: document.getElementById('pwd').value}) 
      });
      if (res.ok) {
        document.getElementById('authOverlay').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setInterval(fetchLogs, 2000);
      }
    }

    async function api(cmd) { await fetch(`/api/${cmd}`, { method: 'POST' }); }

    async function fetchLogs() {
      const res = await fetch('/api/status');
      if (!res.ok) return;
      const data = await res.json();
      const stream = document.getElementById('logStream');
      stream.innerHTML = data.state.logs.map(l => `
        <div class="mb-1 ${l.type === 'TRADE' ? 'text-green-400' : 'text-gray-300'}">
          [${l.time.split('T')[1].split('.')[0]}] [${l.type}] ${l.msg}
        </div>
      `).join('');
    }
  </script>
</body>
</html>
