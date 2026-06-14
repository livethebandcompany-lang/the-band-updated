import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import InviteCode from '@/models/InviteCode';
import { redirect } from 'next/navigation';
import InvitesClient from '@/components/admin/InvitesClient';

export default async function InvitesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/admin');

  await connectDB();
  const invites = await InviteCode.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  // Convert to plain objects
  const plainInvites = invites.map(inv => ({
    _id: inv._id.toString(),
    code: inv.code,
    role: inv.role,
    allowedEmail: inv.allowedEmail,
    expiresAt: inv.expiresAt.toISOString(),
    isUsed: inv.isUsed,
    createdBy: {
      name: inv.createdBy?.name || 'Admin'
    }
  }));

  return <InvitesClient initialInvites={plainInvites} />;
}
