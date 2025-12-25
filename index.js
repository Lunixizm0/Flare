const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG = {
  system: ['system', 'bios', 'baseboard', 'chassis', 'uuid'],
  os: ['time', 'osInfo', 'versions', 'users', 'shell'],
  cpu: ['cpu', 'cpuFlags', 'cpuCache', 'cpuCurrentSpeed', 'cpuTemperature'],
  memory: ['mem', 'memLayout'],
  disk: ['diskLayout', 'blockDevices', 'fsSize', 'fsOpenFiles', 'fsStats', 'disksIO'],
  network: ['networkInterfaces', 'networkInterfaceDefault', 'networkGatewayDefault', 'networkStats', 'networkConnections', 'inetLatency', 'wifiNetworks', 'wifiInterfaces', 'wifiConnections'],
  graphics: ['graphics'],
  power: ['battery'],
  peripherals: ['bluetoothDevices', 'audio', 'printer', 'usb'],
  processes: [['services', '*'], 'processes', 'currentLoad', 'fullLoad'],
  virtualization: ['dockerInfo', 'dockerImages', 'dockerContainers', 'dockerVolumes', 'vboxInfo']
};

async function collectData() {
  console.log('Data Collector Çalışıyor :D');
  const outputDir = path.join(os.tmpdir(), 'node');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(Object.entries(CONFIG).map(async ([cat, items]) => {
    try {
      console.log(`Collecting ${cat}...`);
      const data = {};
      if (cat === 'os') data.timestamp = new Date().toISOString();
      
      // Dynamic Windows check
      if (cat === 'power' && process.platform === 'win32' && si.powerShell) items.push('powerShell');

      for (const item of items) {
        const [fn, arg] = Array.isArray(item) ? item : [item];
        if (typeof si[fn] === 'function') data[fn] = await si[fn](arg);
      }

      fs.writeFileSync(path.join(outputDir, `${cat}.json`), JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error in ${cat}:`, e.message);
      fs.writeFileSync(path.join(outputDir, `${cat}_error.json`), JSON.stringify({ error: e.message }, null, 2));
    }
  }));

  console.log(`Done. Saved to: ${outputDir}`);
}

collectData();