// 测试 JSON 文件读取
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'context', 'docs', 'index.json');

console.log('Testing JSON file reading...');
console.log('JSON file path:', jsonPath);

try {
    const data = fs.readFileSync(jsonPath, 'utf8');
    console.log('JSON content:', data);
    
    const docs = JSON.parse(data);
    console.log('Parsed docs:', docs);
    console.log('Number of docs:', docs.length);
    
    docs.forEach((doc, index) => {
        console.log(`Doc ${index + 1}:`, doc);
    });
    
    console.log('✓ JSON file reading successful!');
} catch (error) {
    console.error('✗ Error reading JSON file:', error.message);
}
