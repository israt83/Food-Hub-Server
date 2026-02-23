import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth.middleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: UserRole.admin,
      password: process.env.ADMIN_PASSWORD,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existingUser) {
      throw new Error("Admin user already exist");
    }

    const signUpAdmin = await fetch(
      "http://localhost:4000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );
    console.log(signUpAdmin)
    if(signUpAdmin.ok){
        await prisma.user.update({
            where:{
                email : adminData.email as string
            },
            data : {
                emailVerified : true
            }

        })
        console.log('Email verification status updated')
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin()