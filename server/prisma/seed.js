const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Users
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'John Doe',
            password: 'password123', // In real app, hash this
        },
    });

    // Contacts
    await prisma.contact.createMany({
        data: [
            { name: 'Jane Cooper', email: 'jane.cooper@example.com', phone: '+1-202-555-0170', company: 'Microsoft', status: 'Active', avatar: 'bg-emerald-500' },
            { name: 'Cody Fisher', email: 'cody.fisher@example.com', phone: '+1-202-555-0195', company: 'Adobe', status: 'Inactive', avatar: 'bg-rose-500' },
            { name: 'Esther Howard', email: 'esther.howard@example.com', phone: '+1-202-555-0141', company: 'Google', status: 'Active', avatar: 'bg-amber-500' },
            { name: 'Jenny Wilson', email: 'jenny.wilson@example.com', phone: '+1-202-555-0112', company: 'Tesla', status: 'Lead', avatar: 'bg-blue-500' },
            { name: 'Kristin Watson', email: 'kristin.watson@example.com', phone: '+1-202-555-0165', company: 'Facebook', status: 'Active', avatar: 'bg-purple-500' },
        ],
    });

    // Deals
    await prisma.deal.createMany({
        data: [
            { title: 'Enterprise License', value: 12500, company: 'TechCorp', stage: 'Discussion' },
            { title: 'Cloud Migration', value: 45000, company: 'MegaSoft', stage: 'Proposal' },
            { title: 'Training Package', value: 3500, company: 'Startup Inc', stage: 'Won' },
            { title: 'Consulting Audit', value: 8000, company: 'Finance LLC', stage: 'Lead' },
        ],
    });

    // Tasks
    await prisma.task.createMany({
        data: [
            { title: 'Design System Update', tag: 'Design', stage: 'In Progress', priority: 'High', color: 'bg-purple-500' },
            { title: 'API Integration', tag: 'Backend', stage: 'To Do', priority: 'Medium', color: 'bg-blue-500' },
            { title: 'User Testing', tag: 'QA', stage: 'Done', priority: 'Low', color: 'bg-emerald-500' },
        ],
    });

    // Backlog
    await prisma.backlogItem.createMany({
        data: [
            { title: 'Research Competitor Pricing', type: 'Research', points: 3 },
            { title: 'Update Privacy Policy', type: 'Legal', points: 1 },
            { title: 'Optimize Database Queries', type: 'Performance', points: 8 },
            { title: 'Create Email Templates', type: 'Marketing', points: 2 },
        ],
    });

    // Invoices
    await prisma.invoice.createMany({
        data: [
            { id: 'INV-001', client: 'Acme Corp', amount: 12000, date: '2023-10-15', status: 'Paid' },
            { id: 'INV-002', client: 'Globex Inc', amount: 8500, date: '2023-11-02', status: 'Pending' },
            { id: 'INV-003', client: 'Soylent Corp', amount: 22000, date: '2023-11-20', status: 'Overdue' },
        ],
    });

    console.log('Database seeded successfully.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
