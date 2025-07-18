"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LogOut,
  Home,
  Camera,
  Newspaper,
  Users,
  Stethoscope,
  Shield,
  ChevronDown,
  Edit,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface UserButtonProps {
  className?: string;
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

interface QuickLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export default function BHIUserButton({ className, isMobile, onMobileMenuClose }: UserButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user || !currentUser) {
    return (
      <div className="w-8 h-8 bg-[#f37c1b]/20 rounded-full animate-pulse"></div>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isEditor = currentUser.role === 'editor';
  const isPatient = currentUser.role === 'patient';

  // Get user initials for avatar
  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || 'U';
  };

  // Role-based quick links for BHI context
  const getQuickLinks = (): QuickLink[] => {
    if (isAdmin) {
      return [
        {
          label: 'Admin Dashboard',
          href: '/dashboard',
          icon: Home,
        },
        {
          label: 'Manage Gallery',
          href: '/dashboard/gallery',
          icon: Camera,
        },
        {
          label: 'Manage News',
          href: '/dashboard/news',
          icon: Newspaper,
        },
        {
          label: 'Manage Programs',
          href: '/dashboard/programs',
          icon: Stethoscope,
        },
      ];
    }

    if (isEditor) {
      return [
        {
          label: 'Editor Dashboard',
          href: '/dashboard',
          icon: Home,
        },
        {
          label: 'Edit Gallery',
          href: '/dashboard/gallery',
          icon: ImageIcon,
        },
        {
          label: 'Edit News',
          href: '/dashboard/news',
          icon: Edit,
        },
        {
          label: 'Edit Programs',
          href: '/dashboard/programs',
          icon: FileText,
        },
      ];
    }

    // Patients don't get dashboard access
    return [];
  };

  const quickLinks: QuickLink[] = getQuickLinks();

  const handleSignOut = () => {
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    }
    signOut({ redirectUrl: '/' });
  };

  // Only show dashboard access for admin and editor roles
  const hasDashboardAccess = isAdmin || isEditor;
  
  // For patients, show a simple sign out button
  if (isPatient) {
    // Mobile version - integrated into menu
    if (isMobile) {
      return (
        <div className="space-y-3">
          {/* User Info Display */}
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#f37c1b]/20">
            <div className="w-10 h-10 rounded-full bg-[#f37c1b] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-[#1c140d] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-[#1c140d]/70 truncate">
                Member
              </p>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      );
    }

    // Desktop version - dropdown
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`h-10 px-3 rounded-full hover:bg-[#f37c1b]/10 transition-colors ${className}`}
          >
            <div className="flex items-center space-x-2">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#f37c1b] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              
              {/* User Info */}
              <div className="hidden sm:block text-left flex-1">
                <p className="text-sm font-medium text-[#1c140d] leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-[#1c140d]/70 capitalize">
                    Member
                  </p>
                </div>
              </div>
              
              <ChevronDown className="w-4 h-4 text-[#1c140d]/70" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 shadow-lg border border-[#f37c1b]/20" side="bottom" sideOffset={4}>
          {/* User Info Header */}
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#f37c1b] text-white flex items-center justify-center font-medium">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1c140d] truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-[#1c140d]/70 truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="text-xs border-[#f37c1b]/30 text-[#f37c1b]">
                    Member
                  </Badge>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#f37c1b]/20" />

          {/* Sign Out */}
          <div className="p-2">
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer flex items-center px-2 py-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Admin/Editor users
  // Mobile version - integrated into menu
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* User Info Display */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#f37c1b]/20">
          <div className="w-10 h-10 rounded-full bg-[#f37c1b] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-[#1c140d] truncate">
              {user.firstName} {user.lastName}
            </p>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-[#1c140d]/70 capitalize">
                {currentUser.role}
              </p>
              {isAdmin && (
                <Shield className="w-3 h-3 text-[#f37c1b]" />
              )}
              {isEditor && (
                <Edit className="w-3 h-3 text-[#f37c1b]" />
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        {hasDashboardAccess && quickLinks.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#1c140d]/60 uppercase tracking-wider px-2 mb-2">
              Quick Access
            </p>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (onMobileMenuClose) {
                    onMobileMenuClose();
                  }
                }}
                className="flex items-center px-3 py-2 rounded-md hover:bg-[#f37c1b]/5 transition-colors"
              >
                <link.icon className="w-4 h-4 mr-3 text-[#1c140d]/70" />
                <span className="flex-1 text-sm text-[#1c140d]">{link.label}</span>
                {link.badge && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs bg-[#f37c1b] text-white">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-10 px-3 rounded-full hover:bg-[#f37c1b]/10 transition-colors ${className}`}
        >
          <div className="flex items-center space-x-2">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#f37c1b] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            
            {/* User Info */}
            <div className="hidden sm:block text-left flex-1">
              <p className="text-sm font-medium text-[#1c140d] leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-[#1c140d]/70 capitalize">
                  {currentUser.role}
                </p>
                {isAdmin && (
                  <Shield className="w-3 h-3 text-[#f37c1b]" />
                )}
                {isEditor && (
                  <Edit className="w-3 h-3 text-[#f37c1b]" />
                )}
              </div>
            </div>
            
            <ChevronDown className="w-4 h-4 text-[#1c140d]/70" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 shadow-lg border border-[#f37c1b]/20" side="bottom" sideOffset={4}>
        {/* User Info Header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#f37c1b] text-white flex items-center justify-center font-medium">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1c140d] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[#1c140d]/70 truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs border-[#f37c1b]/30 text-[#f37c1b]">
                  {currentUser.role}
                </Badge>
                {isAdmin && (
                  <Shield className="w-3 h-3 text-[#f37c1b] ml-1" />
                )}
                {isEditor && (
                  <Edit className="w-3 h-3 text-[#f37c1b] ml-1" />
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#f37c1b]/20" />

        {/* Quick Links Section - Only show for admin/editor */}
        {hasDashboardAccess && quickLinks.length > 0 && (
          <>
            <div className="p-2">
              <p className="text-xs font-semibold text-[#1c140d]/60 uppercase tracking-wider px-2 mb-2">
                Quick Access
              </p>
              {quickLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild className="cursor-pointer">
                  <Link 
                    href={link.href} 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-[#f37c1b]/5"
                    onClick={() => {
                      if (isMobile && onMobileMenuClose) {
                        onMobileMenuClose();
                      }
                    }}
                  >
                    <link.icon className="w-4 h-4 mr-3 text-[#1c140d]/70" />
                    <span className="flex-1 text-sm text-[#1c140d]">{link.label}</span>
                    {link.badge && (
                      <Badge variant="secondary" className="ml-2 h-5 text-xs bg-[#f37c1b] text-white">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-[#f37c1b]/20" />
          </>
        )}

        {/* Sign Out */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center px-2 py-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
