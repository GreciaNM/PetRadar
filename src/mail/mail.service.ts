import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  private getTransporter() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  buildMapUrl(
    lostLng: number,
    lostLat: number,
    foundLng: number,
    foundLat: number,
  ) {
    const token = this.configService.get<string>('MAPBOX_TOKEN');

    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${lostLng},${lostLat}),pin-s+0000ff(${foundLng},${foundLat})/auto/700x400?access_token=${token}`;
  }

  async sendFoundPetNotification(to: string, payload: any) {
    const transporter = this.getTransporter();

    const mapSection = payload.mapUrl
      ? `
        <hr style="margin:20px 0;">
        <h2>📍 Ubicación</h2>
        <img
          src="${payload.mapUrl}"
          alt="Mapa estático"
          style="width:100%; border-radius:12px; border:1px solid #ddd;"
        />
      `
      : `
        <hr style="margin:20px 0;">
        <h2>📍 Ubicación</h2>
        <p>Mapa no disponible por el momento.</p>
      `;

    await transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to,
      subject: '🐾 Posible coincidencia de mascota encontrada - PetRadar',
      html: `
<div style="background:#0f172a; padding:30px; font-family:Arial, sans-serif;">

  <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.2);">

    <div style="background:linear-gradient(135deg,#2563eb,#9333ea); padding:25px; color:white;">
      <h1 style="margin:0;">🐾 PetRadar</h1>
      <p style="margin:5px 0 0;">Posible coincidencia detectada</p>
    </div>

    <div style="padding:25px;">

      <div style="background:#ecfeff; border:1px solid #67e8f9; padding:15px; border-radius:12px; margin-bottom:20px;">
        📍 Se encontró una mascota a
        <strong>${payload.distance_meters} metros</strong> de donde se perdió
      </div>

      <h2 style="color:#7c3aed;">Mascota encontrada</h2>
      <p><strong>Especie:</strong> ${payload.found_species}</p>
      <p><strong>Raza:</strong> ${payload.found_breed ?? 'No identificada'}</p>
      <p><strong>Color:</strong> ${payload.found_color}</p>
      <p><strong>Tamaño:</strong> ${payload.found_size}</p>
      <p><strong>Descripción:</strong> ${payload.found_description}</p>
      <p><strong>Dirección:</strong> ${payload.found_address}</p>

      <hr style="margin:20px 0;">

      <h2 style="color:#16a34a;">Mascota perdida</h2>
      <p><strong>Nombre:</strong> ${payload.lost_name}</p>
      <p><strong>Especie:</strong> ${payload.lost_species}</p>
      <p><strong>Raza:</strong> ${payload.lost_breed}</p>
      <p><strong>Color:</strong> ${payload.lost_color}</p>
      <p><strong>Tamaño:</strong> ${payload.lost_size}</p>
      <p><strong>Descripción:</strong> ${payload.lost_description}</p>
      <p><strong>Dirección:</strong> ${payload.lost_address}</p>

      <hr style="margin:20px 0;">

      <h2 style="color:#ea580c;">Contacto de quien encontró a la mascota</h2>
      <p><strong>Nombre:</strong> ${payload.finder_name}</p>
      <p><strong>Email:</strong> ${payload.finder_email}</p>
      <p><strong>Tel:</strong> ${payload.finder_phone}</p>

      <hr style="margin:20px 0;">

      <h2 style="color:#2563eb;">Datos del dueño</h2>
      <p><strong>Nombre:</strong> ${payload.lost_owner_name}</p>
      <p><strong>Correo:</strong> ${payload.lost_owner_email}</p>
      <p><strong>Teléfono:</strong> ${payload.lost_owner_phone}</p>

      ${mapSection}

    </div>

    <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#475569;">
      PetRadar - Sistema de localización de mascotas
    </div>

  </div>
</div>
`,
    });
  }
}