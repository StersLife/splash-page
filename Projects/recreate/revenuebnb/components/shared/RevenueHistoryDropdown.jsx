'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, MapPin } from "lucide-react";
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/authContext';
import { useRouter } from 'next/navigation';

const RevenueHistoryDropdown = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user} = useUser();
  const supabase = createClient();
    useEffect(() => {
    const fetchRevenueReports = async () => {
      try {
        const { data, error } = await supabase
          .from('revenue_reports')
          .select(`
            id,
            location,
            created_at,
            created_by_email
          `)
          .eq('created_by_email', user.email)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setReports(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching revenue reports:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchRevenueReports();
    }
  }, [user?.email, supabase]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if(!user) return null

  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-11 px-0">
          <History className="h-[1.6rem] w-[1.6rem] text-slate-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-white">
        <DropdownMenuLabel className="px-4 py-3 text-base font-semibold border-b">
          Revenue History
        </DropdownMenuLabel>
        <ScrollArea className="h-[320px]">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-slate-500">
              Loading reports...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-sm text-red-500">
              {error}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-slate-500">
              No reports found
            </div>
          ) : (
            reports.map((report) => (
              <DropdownMenuItem 
                key={report.id} 
                className="px-4 py-3 focus:bg-slate-50 cursor-pointer border-b last:border-0"
                onClick={() => {
                  // You can handle click events here if needed
                  console.log('Report clicked:', report);
                  router.push(`/revenue-report/${report.id}`);
                }}
              >
                <div className="flex gap-3 w-full">
                  <div className="flex items-start justify-center pt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                      <MapPin className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 leading-tight">
                        {report.location.address}
                      </span>
                      <span className="text-sm text-slate-500 mt-1">
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RevenueHistoryDropdown;