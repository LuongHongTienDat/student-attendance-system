require("dotenv").config();


const knex = require('./model/connectDB');
const bcrypt = require('bcrypt');//hash password
const crypto = require('crypto');

// For .env access



const users = [
    {
        fullName:'Lương Hồng Tiến Đạt',
        email:'dat.luongmason@hcmut.edu.vn',
        phone:'0989898989',
        id: '2012924',
        password:'123456789',
        role: 1,
        birthday: '11/08/2002',
        status:"accepted"
    },
    {
        fullName:'Phạm Hữu Phú',
        email:'phu.pham0966447022@hcmut.edu.vn',
        phone:'0989898989',
        id: '2010516',
        password:'123456789',
        role: 0,
        birthday: '11/08/2002',
        status:"accepted"
    },
    {
        fullName:'Nguyễn Trung Nghĩa',
        email:'nghia.nguyen29@hcmut.edu.vn',
        phone:'0989898989',
        id: '2010448',
        password:'123456789',
        role: 0,
        birthday: '11/08/2002',
        status:"accepted"

    }
]

const events = [
    {
        id:crypto.randomUUID(),
        name: "Mùa Hè Xanh",
        creator_email: 'phu.pham0966447022@hcmut.edu.vn',
        location: "Đồng Tháp",
        start_date: (new Date()).toString(),
        end_date: (new Date( new Date().getTime() + 86400000*2 )).toString(),
    },
    {
        id:crypto.randomUUID(),
        name: "Xuân Tình Nguyện",
        creator_email: 'nghia.nguyen29@hcmut.edu.vn',
        location: "Thủ Đức",
        start_date: (new Date()).toString(),
        end_date: (new Date( new Date().getTime() + 86400000*2 )).toString(),

    }, 
    {
        id:crypto.randomUUID(),
        name: "Job Fair",
        creator_email: 'phu.pham0966447022@hcmut.edu.vn',
        location: "Quận 10",
        start_date: (new Date()).toString(),
        end_date: (new Date( new Date().getTime() + 86400000*2 )).toString(),
    }, 
    {
        id:crypto.randomUUID(),
        name: "Job Fair 2",
        creator_email: 'nghia.nguyen29@hcmut.edu.vn',
        location: "Quận 10",
        start_date: (new Date()).toString(),
        end_date: (new Date( new Date().getTime() + 86400000*2 )).toString(),
    },     
]
const event_attendances = [
    {
        SID: '2012924',
        fname: 'Đạt',
        lname: 'Lương Hồng Tiến'
    },
    {
        SID: '2010448',
        fname: 'Nghĩa',
        lname: 'Nguyễn Trung'
    },
    {
        SID: '2010516',
        fname: 'Phú',
        lname: 'Phạm Hữu'
    },
    {
        SID: '2012538',
        fname: 'Uyên',
        lname: 'Nguyễn Thị Minh'
    },
    {
        SID: '2000000',
        fname: 'Hoàng',
        lname: 'Vũ Trần'
    },
    {
        SID: '2010455',
        fname: 'Ngọc',
        lname: 'Tiêu Thái'
    },
]
const files = []
const importData = async () => {
    try {
        const newUsers = await Promise.all(users.map(async (user) => {
            user.password = await bcrypt.hash(user.password,5);
            return user;
        }));

        if (await knex.schema.hasTable('events')) {
            await knex('events').del()
        }
        if (await knex.schema.hasTable('users')) {
            await knex('users').del()
        }
        if (await knex.schema.hasTable('files')) {
            await knex('files').del()
        }
        if (await knex.schema.hasTable('event_attendances')) {
            await knex('event_attendances').del()
        }

        if (! await knex.schema.hasTable('users')) {
            await knex.schema.createTable('users', function(table) {
                table.string('email').primary();
                table.string('id').notNullable();
                table.string('fullName').notNullable();
                table.string('birthday').notNullable();
                table.string('password').notNullable();
                table.integer('role').notNullable().defaultTo(0);
                table.string('status').notNullable().defaultTo('pending');
                table.string('phone').notNullable();
            });
        }


        if (! await knex.schema.hasTable('events')) {
            await knex.schema.createTable('events', function(table) {
                table.string('id').primary();
                table.string('name').notNullable();
                table.string('creator_email').notNullable();
                table.string('status').notNullable().defaultTo('pending');
                table.string('location').notNullable();
                table.string('start_date').defaultTo((new Date()).toString());
                table.string('end_date').defaultTo((new Date()).toString());
            });
        }

        if (! await knex.schema.hasTable('event_attendances')) {
            await knex.schema.createTable('event_attendances', function(table) {
                table.string('SID').notNullable();
                table.string('EID').notNullable();
                table.string('fname').defaultTo('');
                table.string('lname').defaultTo('');
                table.integer('check_in').defaultTo(0);
                table.integer('check_out').defaultTo(0);
            });
        }

        if (! await knex.schema.hasTable('files')) {
            await knex.schema.createTable('files', function(table) {
                table.string('fileName').primary();
                table.string('name').notNullable();
                table.string('uploadedTime').notNullable();
            });
        }  
        
        await knex('users').insert(newUsers)
        await knex('events').insert(events);

        // await Promise.all(events.forEach((event) => {
        //     event_attendances.forEach(async (event_attendance) => {
        //     });   
        // }));
        for await (const event of events) {
            for await(const event_attendance of event_attendances) {
                await knex('event_attendances').insert({...event_attendance, EID: event.id});
            }        
        }

        console.log("Sucessfully imported data in database!");
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
      if (await knex.schema.hasTable('events')) {
        await knex('events').del()
      }
      if (await knex.schema.hasTable('users')) {
        await knex('users').del()
      }
      if (await knex.schema.hasTable('files')) {
        await knex('files').del()
      }
      if (await knex.schema.hasTable('event_attendances')) {
        await knex('event_attendances').del()
      }
      console.log("Sucessfully destroyed data in database!");
      process.exit();
    } catch (error) {
      console.error(`${error}`);
      process.exit(1);
    }
  }
  
  if(process.argv[2] === '-d'){
      destroyData()
  } else {
      importData()
  }