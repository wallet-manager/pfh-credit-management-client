import { createCipheriv, randomBytes, createPublicKey, createHash, createECDH, publicEncrypt, createCipher, createPrivateKey } from 'crypto';
import * as eccrypto from 'eccrypto';

export interface PublicKeyDTO {
  publicKey: string;
}

export interface SetPinEncryptedDTO {
  pin: string;
  encryptedSymmetricKey: string;
  checksum: string;
}

export function generateDHKeys() {
  // const ecdh = createECDH("prime256v1");
  // ecdh.generateKeys();
  // const publicKeyB64 = ecdh.getPublicKey("base64");
  // const privateKeyB64 = ecdh.getPrivateKey("base64");
  // console.info(publicKeyB64);

  const privateKeyA = eccrypto.generatePrivate();
  const publicKeyA = eccrypto.getPublic(privateKeyA);
  console.info(publicKeyA.toString("base64"));

  // const sharedSecretHashB64 = 
  //   createHash("sha256")
  //   .update(sharedSecretB64, "base64")
  //   .digest("base64");
  // return { publicKeyB64, privateKeyB64, sharedSecretB64, sharedSecretHashB64 };
}

export class EncryptCardPin {

  public static async createSetPinEncryptedPayload(publicKeyDTO: PublicKeyDTO, plainPin: string) {
    const AES_CIPHER_TRANSFORMATION = 'aes-256-cbc';

    // Encrypt PIN with AES
    const aesKey = randomBytes(32);
    const encryptedPin = this.encrypt(AES_CIPHER_TRANSFORMATION, aesKey, plainPin);

    // Encrypt AES key with ECC using the received public key. Public key is encoded with Base64
    const encryptedAesKey = await this.eccEncrypt(publicKeyDTO.publicKey, aesKey);

    // Create a payload
    const setPinDTO: SetPinEncryptedDTO = {
      pin: encryptedPin.toString('base64'), // Encode encrypted PIN with Base64
      encryptedSymmetricKey: encryptedAesKey.toString('base64'), // Encode encrypted AES key with Base64
      checksum: createHash('sha256').update(plainPin).digest('hex'),
    };
    return setPinDTO;
  }

  private static generateAESKey(length: number): Buffer {
    return randomBytes(length / 8);
  }

  private static encrypt(cipherTransformation: string, keyBytes: Buffer, message: string): Buffer {
    const iv = randomBytes(16);
    const cipher = createCipheriv(cipherTransformation, keyBytes, iv);
    let encrypted = cipher.update(message, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  }


  private  static async eccEncrypt(publicKey: string, plainBytes: Buffer) {
    const key = Buffer.from(publicKey, 'base64');
    
    const encrypted = await eccrypto.encrypt(key, plainBytes);
    return encrypted.ciphertext
  }
}