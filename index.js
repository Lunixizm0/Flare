const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function collectData() {
  console.log('Data Collector is running :)');
  try {
    const data = {
      timestamp: new Date().toISOString(),
      time: si.time(),
      // System & OS
      system: await si.system(),
      bios: await si.bios(),
      baseboard: await si.baseboard(),
      chassis: await si.chassis(),
      osInfo: await si.osInfo(),
      uuid: await si.uuid(),
      versions: await si.versions(),
      users: await si.users(),
      
      // CPU
      cpu: await si.cpu(),
      cpuFlags: await si.cpuFlags(),
      cpuCache: await si.cpuCache(),
      cpuCurrentSpeed: await si.cpuCurrentSpeed(),
      cpuTemperature: await si.cpuTemperature(),
      
      // Memory
      mem: await si.mem(),
      memLayout: await si.memLayout(),
      
      // Graphics
      graphics: await si.graphics(),
      
      // Battery & Power
      battery: await si.battery(),
      powerShell: (process.platform === 'win32' && si.powerShell) ? await si.powerShell() : null,
      
      // Disk & FS
      diskLayout: await si.diskLayout(),
      blockDevices: await si.blockDevices(),
      fsSize: await si.fsSize(),
      fsOpenFiles: await si.fsOpenFiles(), // May require privileges
      fsStats: await si.fsStats(),

      // Network
      networkInterfaces: await si.networkInterfaces(),
      networkInterfaceDefault: await si.networkInterfaceDefault(),
      networkGatewayDefault: await si.networkGatewayDefault(),
      networkStats: await si.networkStats(),
      networkConnections: await si.networkConnections(), // May require privileges
      wifiNetworks: await si.wifiNetworks(), // May require privileges
      
      // Peripherals
      bluetoothDevices: await si.bluetoothDevices(),
      audio: await si.audio(),
      printer: await si.printer(),
      usb: await si.usb(),
      
      // Processes & Services
      services: await si.services('*'), // May be heavy
      processes: await si.processes(),
      processLoad: await si.currentLoad(),
      
      // Virtualization
      dockerInfo: await si.dockerInfo(),
      dockerContainers: await si.dockerContainers(),
      vbInfo: await si.vboxInfo(),
    };

    const filename = `flare_output_${Date.now()}.json`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('Data collection complete.');
    console.log(`Output saved to: ${filePath}`);

  } catch (e) {
    console.error('Error collecting system data:', e);
    process.exit(1);
  }
}

collectData();
