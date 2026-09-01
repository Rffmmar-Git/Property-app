import bcrypt from "bcrypt";
import prisma from "./src/config/prisma";
import { user_role } from "./src/generated/prisma/enums";

async function main() {
  console.log("🌱 Starting test data seed...\n");

  // ==========================================
  // 1. DUMMY TENANT
  // ==========================================

  const tenantPassword = await bcrypt.hash("Tenant123!", 10);

  const tenant = await prisma.users.upsert({
    where: {
      email: "dummy.tenant@property.test",
    },
    update: {
      is_verified: true,
      role: user_role.TENANT,
      password: tenantPassword,
    },
    create: {
      full_name: "Dummy Tenant",
      email: "dummy.tenant@property.test",
      password: tenantPassword,
      role: user_role.TENANT,
      is_verified: true,
    },
  });

  console.log(`✅ Tenant: ${tenant.email}`);
  console.log(`   ID: ${tenant.id}`);

  // ==========================================
  // 2. TENANT PROFILE
  // ==========================================

  const tenantProfile = await prisma.tenant_profiles.upsert({
    where: {
      user_id: tenant.id,
    },
    update: {},
    create: {
      user_id: tenant.id,
      company_name: "Dummy Property Management",
      identity_number: "DUMMY-ID-001",
      tax_number: "DUMMY-TAX-001",
      bank_name: "BCA",
      bank_account_name: "Dummy Property Management",
      bank_account_number: "1234567890",
    },
  });

  console.log(`✅ Tenant profile: ${tenantProfile.id}`);

  // ==========================================
  // 3. DUMMY CUSTOMER
  // ==========================================

  const customerPassword = await bcrypt.hash("Customer123!", 10);

  const customer = await prisma.users.upsert({
    where: {
      email: "dummy.customer@property.test",
    },
    update: {
      is_verified: true,
      role: user_role.CUSTOMER,
      password: customerPassword,
    },
    create: {
      full_name: "Dummy Customer",
      email: "dummy.customer@property.test",
      password: customerPassword,
      role: user_role.CUSTOMER,
      is_verified: true,
    },
  });

  console.log(`✅ Customer: ${customer.email}`);
  console.log(`   ID: ${customer.id}`);

  // ==========================================
  // 4. DESTINATION
  // ==========================================

  const destination = await prisma.destinations.upsert({
    where: {
      city_province: {
        city: "Medan",
        province: "Sumatera Utara",
      },
    },
    update: {},
    create: {
      city: "Medan",
      province: "Sumatera Utara",
    },
  });

  console.log(`✅ Destination: ${destination.city}`);

  // ==========================================
  // 5. PROPERTY CATEGORY
  // ==========================================

  const category = await prisma.property_categories.upsert({
    where: {
      name: "Hotel",
    },
    update: {},
    create: {
      name: "Hotel",
    },
  });

  console.log(`✅ Category: ${category.name}`);

  // ==========================================
  // 6. PROPERTY
  // ==========================================

  const existingProperty = await prisma.properties.findFirst({
    where: {
      tenant_id: tenant.id,
      name: "Dummy Hotel Medan",
    },
  });

  const property =
    existingProperty ??
    (await prisma.properties.create({
      data: {
        tenant_id: tenant.id,
        category_id: category.id,
        destination_id: destination.id,
        name: "Dummy Hotel Medan",
        description:
          "Dummy hotel created for reservation feature testing.",
        address: "Jl. Dummy Property No. 1, Medan, Sumatera Utara",
        latitude: 3.595196,
        longitude: 98.672226,
      },
    }));

  console.log(`✅ Property: ${property.name}`);
  console.log(`   ID: ${property.id}`);

  // ==========================================
  // 7. PROPERTY IMAGES
  // ==========================================

  const imageCount = await prisma.property_images.count({
    where: {
      property_id: property.id,
    },
  });

  if (imageCount === 0) {
    await prisma.property_images.createMany({
      data: [
        {
          property_id: property.id,
          image_url:
            "https://placehold.co/1200x800?text=Dummy+Hotel",
          display_order: 1,
        },
        {
          property_id: property.id,
          image_url:
            "https://placehold.co/1200x800?text=Dummy+Room",
          display_order: 2,
        },
      ],
    });
  }

  console.log("✅ Property images ready");

  // ==========================================
  // 8. DELUXE ROOM
  // ==========================================

  let deluxeRoom = await prisma.rooms.findFirst({
    where: {
      property_id: property.id,
      room_name: "Deluxe Room",
    },
  });

  if (!deluxeRoom) {
    deluxeRoom = await prisma.rooms.create({
      data: {
        property_id: property.id,
        room_name: "Deluxe Room",
        description: "Deluxe room for up to 2 guests.",
        capacity: 2,
        base_price: 500000,
        total_rooms: 5,
      },
    });
  }

  console.log(`✅ Deluxe Room: ${deluxeRoom.id}`);

  // ==========================================
  // 9. FAMILY ROOM
  // ==========================================

  let familyRoom = await prisma.rooms.findFirst({
    where: {
      property_id: property.id,
      room_name: "Family Room",
    },
  });

  if (!familyRoom) {
    familyRoom = await prisma.rooms.create({
      data: {
        property_id: property.id,
        room_name: "Family Room",
        description: "Family room for up to 4 guests.",
        capacity: 4,
        base_price: 850000,
        total_rooms: 3,
      },
    });
  }

  console.log(`✅ Family Room: ${familyRoom.id}`);

  // ==========================================
  // 10. ROOM AVAILABILITY - 30 DAYS
  // ==========================================

  const availabilityData = [];

  for (let i = 1; i <= 30; i++) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + i);

    availabilityData.push({
      room_id: deluxeRoom.id,
      available_date: new Date(date),
      available_rooms: 5,
      is_closed: false,
    });

    availabilityData.push({
      room_id: familyRoom.id,
      available_date: new Date(date),
      available_rooms: 3,
      is_closed: false,
    });
  }

  await prisma.room_availabilities.createMany({
    data: availabilityData,
    skipDuplicates: true,
  });

  console.log("✅ Room availability: 30 days");

  // ==========================================
  // 11. PEAK SEASON
  // ==========================================

  const existingPeakSeason =
    await prisma.peak_season_rates.findFirst({
      where: {
        room_id: deluxeRoom.id,
        start_date: new Date("2026-12-20"),
        end_date: new Date("2026-12-31"),
      },
    });

  if (!existingPeakSeason) {
    await prisma.peak_season_rates.create({
      data: {
        room_id: deluxeRoom.id,
        start_date: new Date("2026-12-20"),
        end_date: new Date("2026-12-31"),
        adjustment_type: "PERCENTAGE",
        adjustment_value: 20,
      },
    });
  }

  console.log("✅ Peak season rate ready");

  // ==========================================
  // SUMMARY
  // ==========================================

  console.log("\n========================================");
  console.log("🎉 TEST DATA SEED COMPLETED");
  console.log("========================================");

  console.log("\nTENANT");
  console.log(`Email    : ${tenant.email}`);
  console.log("Password : Tenant123!");
  console.log(`ID       : ${tenant.id}`);

  console.log("\nCUSTOMER");
  console.log(`Email    : ${customer.email}`);
  console.log("Password : Customer123!");
  console.log(`ID       : ${customer.id}`);

  console.log("\nPROPERTY");
  console.log(`Name     : ${property.name}`);
  console.log(`ID       : ${property.id}`);

  console.log("\nROOMS");
  console.log(`Deluxe   : ${deluxeRoom.id}`);
  console.log(`Family   : ${familyRoom.id}`);

  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ SEED FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });