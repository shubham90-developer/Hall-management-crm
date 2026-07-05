'use client'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useGetMeQuery } from '@/store/authApi'
const ProfileDropdown = () => {
  const { data, isLoading, error } = useGetMeQuery()
  if (isLoading) {
    return <p>loading logo</p>
  }

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown "
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image className="rounded-circle" width={32} height={32} src={data?.logo || avatar1} alt="avatar-3" />
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as={'h6'} className="dropdown-header">
          Welcome To Shree Ganesh!
        </DropdownHeader>

        <div className="dropdown-divider my-1" />
        <DropdownItem as={Link} className=" text-danger" href="/auth/sign-in">
          <button
            onClick={() => {
              Cookies.remove('token')
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#e74c3c',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fdecea')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
            <IconifyIcon icon="bx:log-out" className="fs-18 align-middle" />
            Logout
          </button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
