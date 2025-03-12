import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import Message from '../../../../models/Message';
import Vehicle from '../../../../models/Vehicle';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { name, email, phone, subject, message, vehicle } = data;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 });
    }
    
    // Create new message object
    const messageData = {
      name,
      email,
      phone,
      subject,
      message,
    };
    
    // If vehicle info provided, try to find matching vehicle ID
    if (vehicle && vehicle.trim() !== '') {
      try {
        // Split the vehicle string and extract info
        const vehicleInfo = vehicle.split(' ');
        
        if (vehicleInfo.length >= 2) {
          const yearPattern = /^(19|20)\d{2}$/; // Match years 1900-2099
          let year, make, model;
          
          // Parse the first part as a year if it matches year pattern
          if (yearPattern.test(vehicleInfo[0])) {
            year = parseInt(vehicleInfo[0]);
            make = vehicleInfo[1];
            model = vehicleInfo.slice(2).join(' ');
          } else {
            // If first part isn't a year, treat it as the make
            make = vehicleInfo[0];
            model = vehicleInfo.slice(1).join(' ');
          }
          
          // Search for matching vehicle
          const query = {};
          if (year) query.year = year;
          if (make) query.make = { $regex: make, $options: 'i' };
          if (model) query.model = { $regex: model, $options: 'i' };
          
          const vehicle = await Vehicle.findOne(query);
          
          if (vehicle) {
            messageData.vehicleId = vehicle._id;
          }
        }
      } catch (error) {
        console.error('Error matching vehicle:', error);
        // Continue without vehicle ID if there's an error
      }
    }
    
    // Create and save the message
    const newMessage = await Message.create(messageData);
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 