require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Logic
const connectDB = async () => {
  try {
    let uri = process.env.DB_URI;
    
    if (!uri) {
        console.error('❌ DB_URI environment variable is missing!');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Server will remain running, but database operations will fail.');
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const path = require('path');

// Dashboard Dashboard (Tasks assigned to user, Overdue tasks, Task status distribution)
app.get('/api/dashboard', require('./middleware/auth').protect, async (req, res) => {
    try {
        const Project = require('./models/Project');
        const Task = require('./models/Task');
        
        let queryFilter = {};
        if (req.user.role !== 'admin') {
            const userProjects = await Project.find({ members: req.user._id });
            const projectIds = userProjects.map(p => p._id);
            queryFilter = { projectId: { $in: projectIds } };
        }
        
        const tasks = await Task.find(queryFilter);
        
        const overdueTasks = await Task.find({ 
            ...queryFilter,
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' }
        });

        const statusDistribution = await Task.aggregate([
            { $match: queryFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalTasks: tasks.length,
            overdueCount: overdueTasks.length,
            statusDistribution: statusDistribution.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 4028;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
