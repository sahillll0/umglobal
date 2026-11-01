import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <AdminShell
      title="Add New Product"
      subtitle="Fill in the product details below"
      actions={
        <Link href="/admin/products"
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
          ← Back to Products
        </Link>
      }
    >
      <ProductForm />
    </AdminShell>
  );
}
